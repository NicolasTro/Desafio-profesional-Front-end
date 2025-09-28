import { NextResponse } from "next/server";
import { DIGITALMONEY_API_BASE } from "@/lib/env";
import { getTokenFromCookie } from "@/lib/auth";

export async function POST() {
  try {
    const token = await getTokenFromCookie();
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "No token" },
        { status: 401 },
      );
    }

    const upstream = await fetch(`${DIGITALMONEY_API_BASE}/api/logout`, {
      method: "POST",
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!upstream.ok) {
      // upstream.text may not be present on mocked Responses; guard it
      let text = "";
      try {
        // fetch returns a Response which has a text() method; call it if available
        if (typeof (upstream as Response).text === "function") {
          text = await (upstream as Response).text().catch(() => "");
        }
      } catch {
        text = "";
      }
      // Ensure cookie is cleared even when upstream fails (tests expect this)
        try {
          const nh = await import("next/headers");
          const cookiesResult = await nh.cookies();
          const cookieSetter = cookiesResult as unknown as {
            set?: (name: string, value: string, opts?: Record<string, unknown>) => void;
          };
          if (cookieSetter && typeof cookieSetter.set === "function") {
            cookieSetter.set("dm_token", "", { httpOnly: true, maxAge: 0, path: "/" });
          }
        } catch {
          // ignore
        }
      return NextResponse.json(
        { ok: false, details: text || "upstream logout failed" },
        { status: upstream.status || 502 },
      );
    }

    // Respuesta OK + borrado de cookie
    const res = NextResponse.json({ ok: true }, { status: 202 });
    try {
      const resCookies = (res as unknown as { cookies?: { set?: (name: string, value: string, opts?: Record<string, unknown>) => void } }).cookies;
      if (resCookies && typeof resCookies.set === "function") {
        resCookies.set("dm_token", "", {
          httpOnly: true,
          maxAge: 0,
          path: "/",
        });
      } else {
        const nh = await import("next/headers");
        const cookiesResult = await nh.cookies();
        const cookieSetter = cookiesResult as unknown as {
          set?: (name: string, value: string, opts?: Record<string, unknown>) => void;
        };
        if (cookieSetter && typeof cookieSetter.set === "function") {
          cookieSetter.set("dm_token", "", {
            httpOnly: true,
            maxAge: 0,
            path: "/",
          });
        }
      }
    } catch {
      // ignore cookie set failures in tests
    }
    return res;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Logout failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
