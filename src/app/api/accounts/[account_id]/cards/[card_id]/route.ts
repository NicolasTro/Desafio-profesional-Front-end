import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookie } from "@/lib/auth";
import { DIGITALMONEY_API_BASE } from "@/lib/env";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ account_id: string; card_id: string }> }
) {
  try {
    const token = await getTokenFromCookie();
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { account_id: accountId, card_id: cardId } = await params;
    console.log('DELETE /api/accounts/[account_id]/cards/[card_id] - accountId:', accountId, 'cardId:', cardId);

    const upstreamUrl = `${DIGITALMONEY_API_BASE}/api/accounts/${accountId}/cards/${cardId}`;
    const response = await fetch(upstreamUrl, {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    const text = await response.text().catch(() => "");
    if (!response.ok) {
      console.log('Upstream DELETE error:', response.status, text);
      return NextResponse.json({ error: text || 'Upstream error' }, { status: response.status });
    }

    try {
      const json = JSON.parse(text || "{}");
      return NextResponse.json(json, { status: response.status });
    } catch {
      return NextResponse.json({ message: text || 'Deleted' }, { status: response.status });
    }
  } catch (error) {
    console.error('Error in DELETE /api/accounts/[account_id]/cards/[card_id]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
