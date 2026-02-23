import { NextRequest, NextResponse } from "next/server";

// Proxies chat requests to OpenClaw gateway running on same VPS
const OPENCLAW_GATEWAY = process.env.OPENCLAW_GATEWAY_URL ?? "http://127.0.0.1:18789";

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  if (!message) {
    return NextResponse.json({ error: "Mangler melding" }, { status: 400 });
  }

  try {
    const res = await fetch(`${OPENCLAW_GATEWAY}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "AI-tjenesten er ikke tilgjengelig akkurat nå." },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ reply: data.reply });
  } catch {
    return NextResponse.json(
      { error: "Kunne ikke nå AI-agenten. Prøv igjen." },
      { status: 502 }
    );
  }
}
