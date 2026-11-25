/**
 * Tiny serverless health check (Vercel Node function).
 * GET /api/health -> { ok: true }
 * Used to confirm the deployment + SPA rewrite leave /api/* untouched.
 */
export default function handler(_req: Request): Response {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
