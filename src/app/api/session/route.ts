import { NextResponse } from "next/server";
import { getTokenFromCookie, getDecodedTokenFromCookie } from "@/lib/auth";
import { DIGITALMONEY_API_BASE } from "@/lib/env";
import type { UserData, AccountData } from "@/lib/types";

// runtime: Node.js (no edge)
export const runtime = "nodejs";

interface SessionResponse {
  authenticated: boolean;
  user: UserData | null;
  account: AccountData | null;
  exp?: number | null;
  error?: string;
}

export async function GET() {
  try {
    const token = await getTokenFromCookie();
    if (!token) {
      const res: SessionResponse = { authenticated: false, user: null, account: null };
      return NextResponse.json(res, { status: 200 });
    }

    const decoded = await getDecodedTokenFromCookie();
    if (!decoded) {
      const res: SessionResponse = { authenticated: false, user: null, account: null };
      return NextResponse.json(res, { status: 200 });
    }

    // validar expiración
    if (decoded.exp && decoded.exp <= Math.floor(Date.now() / 1000)) {
      const res: SessionResponse = { authenticated: false, user: null, account: null, exp: decoded.exp };
      return NextResponse.json(res, { status: 200 });
    }

    // pedir datos al backend en paralelo
    const [userRes, accountRes] = await Promise.all([
      fetch(`${DIGITALMONEY_API_BASE}/api/users/${decoded.id}`, {
        headers: { Authorization: token },
      }),
      fetch(`${DIGITALMONEY_API_BASE}/api/account`, {
        headers: { Authorization: token },
      }),
    ]);

    let user: UserData | null = null;
    let account: AccountData | null = null;

    if (userRes.ok) {
      const u: unknown = await userRes.json();
      if (typeof u === "object" && u !== null && "id" in u) {
        const obj = u as Record<string, unknown>;
        console.log(obj);
        
        user = {
          id: String(obj.id),
          name: (obj.firstname as string) ?? null,
          lastname: (obj.lastname as string) ?? null,
          email: (obj.email as string) ?? null,
          phone: (obj.phone as string) ?? null,
          dni: (obj.dni as string) ?? null,
          exp: decoded.exp ?? null,
        };
      }
    }

    if (accountRes.ok) {
      const a: unknown = await accountRes.json();
      if (typeof a === "object" && a !== null) {
        const obj = a as Record<string, unknown>;
        console.log(obj);
        
        account = {
          account_id: (obj.account_id as string) || (obj.id as string) || "",
          cvu: (obj.cvu as string) ?? null,
          alias: (obj.alias as string) ?? null,
          available_amount:
            (obj.available_amount as number) ??
            (obj.balance as number) ??
            null,
        };
      }
    }

    const res: SessionResponse = {
      authenticated: true,
      user,
      account,
      exp: decoded.exp ?? null,
    };
    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const res: SessionResponse = { authenticated: false, user: null, account: null, error: message };
    return NextResponse.json(res, { status: 500 });
  }
}
