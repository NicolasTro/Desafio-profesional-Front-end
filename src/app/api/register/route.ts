import { NextResponse } from "next/server";
import { DIGITALMONEY_API_BASE } from "@/lib/env";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      surname,
      dni,
      telefono,
      email,
      password,      
      firstname,
      lastname,
      phone,
    } = body || {};

    const parsedDni =
      typeof dni === "string"
        ? parseInt(dni, 10)
        : typeof dni === "number"
          ? dni
          : NaN;
    const upstreamBody = {
      dni: Number.isNaN(parsedDni) ? 0 : parsedDni,
      email: email ?? "",
      firstname: firstname ?? name ?? "",
      lastname: lastname ?? surname ?? "",
      password: password ?? "",
      phone: phone ?? telefono ?? "",
    };

    const upstream = await fetch(`${DIGITALMONEY_API_BASE}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(upstreamBody),
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") || "";
    const respPayload = contentType.includes("application/json")
      ? await upstream.json()
      : await upstream.text();

    if (!upstream.ok) {
      
      if (
        typeof respPayload === "string" &&
        contentType.includes("text/html")
      ) {
        return NextResponse.json(
          { error: `Upstream ${upstream.status} ${upstream.statusText}` },
          { status: upstream.status },
        );
      }
      if (typeof respPayload === "string") {
        return new NextResponse(respPayload, {
          status: upstream.status,
          headers: { "content-type": contentType || "text/plain" },
        });
      }
      return NextResponse.json(respPayload, { status: upstream.status });
    }

    return NextResponse.json(respPayload, { status: upstream.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Register failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
