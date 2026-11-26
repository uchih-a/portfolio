/**
 * POST /api/contact — portfolio contact form endpoint (Vercel Node
 * function, Web Request/Response API, no SDK: plain fetch to the
 * Resend REST API).
 *
 * Behaviour:
 *  - Only POST is accepted; anything else gets 405.
 *  - Bodies are capped at ~10KB (content-length header + parsed size).
 *  - Anti-spam, in order: a filled honeypot ("company") returns a
 *    silent 200 {ok:true} without sending; submissions faster than
 *    2.5s since form render get the same silent 200; an in-memory
 *    rate limit allows 5 requests per IP per 10 minutes -> 429.
 *  - Server-side validation mirrors the client rules (trim, length
 *    caps, email regex, interest must be in the allowed list) -> 400.
 *  - Sends an email through Resend (HTML with escaped user input +
 *    a plain-text part, subject "[Portfolio] {interest} - {name}",
 *    reply_to = sender). Missing env vars or a Resend failure log
 *    server-side (no secrets, no user data beyond an error code) and
 *    return 500 {ok:false,error:"Could not send message"}.
 *  - The destination address and any env value are never revealed.
 */

const ALLOWED_INTERESTS = [
  'Job opportunity',
  'Duka Manager demo',
  'Custom app',
  'Data work',
  'Something else',
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_CHARS = 10 * 1024;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const MIN_ELAPSED_MS = 2500;

/** Best-effort, per-instance rate limiting (warm invocations only). */
const hits = new Map<string, { count: number; resetAt: number }>();

function json(data: Record<string, unknown>, status: number, extraHeaders?: HeadersInit): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...extraHeaders },
  });
}

const failSend = (): Response => json({ ok: false, error: 'Could not send message' }, 500);

/** Escapes user-controlled text for the HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Removes CR/LF so user text can never inject email headers. */
function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed' }, 405, { allow: 'POST' });
  }

  // Body cap (~10KB): reject early on content-length, then on the read size.
  const declaredLength = Number(req.headers.get('content-length') ?? '0');
  if (declaredLength > MAX_BODY_CHARS) {
    return json({ ok: false, error: 'Payload too large' }, 413);
  }

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return json({ ok: false, error: 'Invalid body' }, 400);
  }
  if (raw.length > MAX_BODY_CHARS) {
    return json({ ok: false, error: 'Payload too large' }, 413);
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }

  // Honeypot: any value means a bot — pretend success, send nothing.
  const honeypot = typeof payload.company === 'string' ? payload.company.trim() : '';
  if (honeypot !== '') {
    return json({ ok: true }, 200);
  }

  // Submissions faster than a human can type the form: same silent 200.
  const elapsed = Number(payload.elapsed);
  if (!Number.isFinite(elapsed) || elapsed < MIN_ELAPSED_MS) {
    return json({ ok: true }, 200);
  }

  // Best-effort in-memory rate limit (per warm instance).
  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
  if (rateLimited(ip)) {
    return json({ ok: false, error: 'Too many requests' }, 429);
  }

  // Validation (mirrors the client rules).
  const name = typeof payload.name === 'string' ? singleLine(payload.name) : '';
  const email = typeof payload.email === 'string' ? singleLine(payload.email).toLowerCase() : '';
  const interest = typeof payload.interest === 'string' ? payload.interest : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  const source = typeof payload.source === 'string' ? singleLine(payload.source) : '';

  if (name.length < 2 || name.length > 80) {
    return json({ ok: false, error: 'Invalid name' }, 400);
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ ok: false, error: 'Invalid email' }, 400);
  }
  if (!(ALLOWED_INTERESTS as readonly string[]).includes(interest)) {
    return json({ ok: false, error: 'Invalid interest' }, 400);
  }
  if (message.length < 10 || message.length > 2000) {
    return json({ ok: false, error: 'Invalid message' }, 400);
  }

  // Required env vars — names only are logged, never values.
  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO) {
    console.error('[contact] missing required env vars; not sending');
    return failSend();
  }
  const from = CONTACT_FROM || 'Portfolio <onboarding@resend.dev>';

  const html = `<!doctype html>
<html><body style="font-family: Arial, Helvetica, sans-serif; color: #1d1a1c;">
  <h2 style="margin: 0 0 16px;">${escapeHtml(interest)}</h2>
  <p style="margin: 0 0 16px;">From <strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p>
  <p style="margin: 0 0 16px; white-space: pre-wrap;">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
  ${source ? `<p style="margin: 0; color: #7a7a7a; font-size: 12px;">Sent from page: ${escapeHtml(source)}</p>` : ''}
</body></html>`;

  const text = `[Portfolio] ${interest}\n\nFrom: ${name} <${email}>\n\n${message}\n${source ? `\nSent from page: ${source}\n` : ''}`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: CONTACT_TO,
        reply_to: email,
        subject: `[Portfolio] ${interest} - ${name}`,
        html,
        text,
      }),
    });

    if (!res.ok) {
      // Only the upstream status code is logged — never the key, the
      // destination address or any user data.
      console.error('[contact] resend responded with status', res.status);
      return failSend();
    }
  } catch (err) {
    console.error('[contact] resend request failed:', (err as Error)?.name ?? 'UnknownError');
    return failSend();
  }

  return json({ ok: true }, 200);
}
