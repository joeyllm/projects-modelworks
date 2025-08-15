export async function POST(req) {
  const data = await req.json().catch(() => ({}));
  return Response.json({
    ok: true,
    receivedCount: Array.isArray(data?.messages) ? data.messages.length : 0,
    meta: data?.meta || null,
    sampleLast: data?.messages?.slice(-1)[0] || null,
    ts: new Date().toISOString(),
  });
}
