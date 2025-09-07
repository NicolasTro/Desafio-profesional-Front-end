import { NextResponse } from "next/server";
import { getTokenFromCookie } from "@/lib/auth";
import { DIGITALMONEY_API_BASE } from "@/lib/env";

export async function PATCH(req: Request, { params }: { params: Promise<{ account_id: string }> }) {
  try {
    const token = await getTokenFromCookie();
    if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const resolved = await params;
    const accountId = resolved.account_id;
    if (!accountId) return NextResponse.json({ error: "account_id missing" }, { status: 400 });

    const body = await req.json();

    const upstream = await fetch(`${DIGITALMONEY_API_BASE}/api/accounts/${accountId}`, {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      cache: 'no-store'
    });

    if (process.env.LOG_API === 'true' || process.env.NODE_ENV !== 'test') {
      console.log("aca viene esto", body);
    }
     

    const contentType = upstream.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await upstream.json() : await upstream.text();

    return NextResponse.json(payload, { status: upstream.status });
  } catch (err: unknown) {
    if (process.env.LOG_API === 'true' || process.env.NODE_ENV !== 'test') {
      console.error('Error in /api/accounts/[account_id] PATCH', err);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
