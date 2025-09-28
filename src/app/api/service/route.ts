import { NextResponse } from 'next/server';
import { DIGITALMONEY_API_BASE } from '@/lib/env';

export async function GET() {
  try {
    const upstream = `${DIGITALMONEY_API_BASE}/service`;
    const res = await fetch(upstream, { cache: 'no-store' });

    if (res.status === 404) {
      return NextResponse.json({ error: 'No services found' }, { status: 404 });
    }

    if (!res.ok) {
      const text = await res.text().catch(() => 'Upstream error');
      return NextResponse.json({ error: text }, { status: 502 });
    }

    const data = await res.json();
    // if upstream returns empty array -> propagate 404
    if (Array.isArray(data) && data.length === 0) {
      return NextResponse.json({ error: 'No services found' }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
