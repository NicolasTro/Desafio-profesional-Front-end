import { NextResponse } from 'next/server';
import { DIGITALMONEY_API_BASE } from '@/lib/env';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  // In Next.js app router params is a Promise that resolves to an object with route params
  const { id } = await params;
  try {
    const upstream = `${DIGITALMONEY_API_BASE}/service/${encodeURIComponent(id)}`;
    const res = await fetch(upstream, { cache: 'no-store' });

    if (res.status === 404) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    if (!res.ok) {
      const text = await res.text().catch(() => 'Upstream error');
      return NextResponse.json({ error: text }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
