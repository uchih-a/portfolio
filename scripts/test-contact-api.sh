#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Contact API smoke tests: validation, honeypot, elapsed and rate limit.
#
# Start the API first:  npm run dev:api     (vercel dev, port 3000)
# Then run:             BASE=http://localhost:3000 ./scripts/test-contact-api.sh
#
# Notes:
#  - Run WITHOUT RESEND_API_KEY configured: "valid" payloads then hit the
#    500 {ok:false,error:"Could not send message"} path and no email is
#    ever sent — exactly what these tests want.
#  - Requests that pass the honeypot + elapsed gates count toward the
#    5-per-10-minutes in-memory rate limit, so the order matters: the
#    rate-limit block runs last.
# ---------------------------------------------------------------------------
set -u
BASE="${BASE:-http://localhost:3000}"
EP="$BASE/api/contact"
BODY_FILE="$(mktemp)"
PASS=0
FAIL=0

post_code() {
  curl -s -o "$BODY_FILE" -w '%{http_code}' -X POST "$EP" \
    -H 'content-type: application/json' --data "$1"
}

expect_post() {
  local want="$1" desc="$2" payload="$3"
  local code body
  code="$(post_code "$payload")"
  body="$(cat "$BODY_FILE")"
  if [ "$code" = "$want" ]; then
    PASS=$((PASS + 1))
    printf 'PASS  %-34s -> %s  %s\n' "$desc" "$code" "$body"
  else
    FAIL=$((FAIL + 1))
    printf 'FAIL  %-34s -> got %s, want %s (%s)\n' "$desc" "$code" "$want" "$body"
  fi
}

VALID='{"name":"Test Sender","email":"test@example.com","interest":"Custom app","message":"This is a long enough message for validation.","elapsed":9999}'

echo "== 1. Methods (only POST is allowed) =="
code="$(curl -s -o "$BODY_FILE" -w '%{http_code}' "$EP")"
if [ "$code" = "405" ]; then PASS=$((PASS + 1)); echo "PASS  GET  rejected                    -> 405"
else FAIL=$((FAIL + 1)); echo "FAIL  GET  rejected                    -> got $code, want 405"; fi
code="$(curl -s -o "$BODY_FILE" -w '%{http_code}' -X PUT "$EP" --data '{}')"
if [ "$code" = "405" ]; then PASS=$((PASS + 1)); echo "PASS  PUT  rejected                    -> 405"
else FAIL=$((FAIL + 1)); echo "FAIL  PUT  rejected                    -> got $code, want 405"; fi

echo
echo "== 2. Validation (400s — these already count toward the rate limit) =="
expect_post 400 'invalid JSON' '{"nope'
expect_post 400 'name too short'          '{"name":"A","email":"test@example.com","interest":"Custom app","message":"This is a long enough message.","elapsed":9999}'
expect_post 400 'bad email'               '{"name":"Test Sender","email":"not-an-email","interest":"Custom app","message":"This is a long enough message.","elapsed":9999}'
expect_post 400 'interest not allowed'    '{"name":"Test Sender","email":"test@example.com","interest":"Free money","message":"This is a long enough message.","elapsed":9999}'
expect_post 400 'message too short'       '{"name":"Test Sender","email":"test@example.com","interest":"Custom app","message":"short","elapsed":9999}'

echo
echo "== 3. Honeypot + elapsed (silent 200, nothing sent) =="
expect_post 200 'honeypot filled'         '{"name":"Test Sender","email":"test@example.com","interest":"Custom app","message":"This is a long enough message.","company":"Cheap SEO","elapsed":9999}'
expect_post 200 'elapsed < 2500ms'        '{"name":"Test Sender","email":"test@example.com","interest":"Custom app","message":"This is a long enough message.","elapsed":100}'

echo
echo "== 4. Valid payload without RESEND_API_KEY (500, no send) =="
expect_post 500 'valid submit, env missing' "$VALID"

echo
echo "== 5. Rate limit: 5 requests / 10 min (earlier requests already counted) =="
RATE_HIT=0
for i in 1 2 3 4 5 6; do
  code="$(post_code "$VALID")"
  body="$(cat "$BODY_FILE")"
  printf '      request %d                          -> %s  %s\n' "$i" "$code" "$body"
  if [ "$code" = "429" ]; then RATE_HIT=1; break; fi
done
if [ "$RATE_HIT" = "1" ]; then
  PASS=$((PASS + 1)); echo "PASS  429 hit within 6 requests"
else
  FAIL=$((FAIL + 1)); echo "FAIL  no 429 within 6 requests"
fi

echo
echo "Summary: $PASS passed, $FAIL failed"
rm -f "$BODY_FILE"
[ "$FAIL" = "0" ] || exit 1
