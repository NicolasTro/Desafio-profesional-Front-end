import { PATCH } from '../[account_id]/route';
import * as authModule from '@/lib/auth';

jest.mock('@/lib/auth');

describe('/api/accounts/[account_id] PATCH', () => {
  afterEach(() => jest.restoreAllMocks());

  it('returns 401 when no token', async () => {
    jest.spyOn(authModule, 'getTokenFromCookie').mockResolvedValue(null as unknown as string | null);
    const res = await PATCH(new Request('/', { method: 'PATCH' }), { params: Promise.resolve({ account_id: 'a1' }) });
    const status = (res as unknown as { status?: number }).status;
    expect(status).toBe(401);
  });

  it('returns 400 when account_id missing', async () => {
    jest.spyOn(authModule, 'getTokenFromCookie').mockResolvedValue('tok');
    const res = await PATCH(new Request('/', { method: 'PATCH' }), { params: Promise.resolve({ account_id: '' }) });
    const status = (res as unknown as { status?: number }).status;
    expect(status).toBe(400);
  });

  it('forwards body to upstream and returns payload', async () => {
    jest.spyOn(authModule, 'getTokenFromCookie').mockResolvedValue('tok');
    (global as unknown as { fetch?: unknown }).fetch = jest.fn(() =>
      Promise.resolve({ ok: true, status: 200, headers: new Headers({ 'content-type': 'application/json' }), json: () => Promise.resolve({ ok: true }) } as unknown as Response),
    );

    const res = await PATCH(new Request('/', { method: 'PATCH', body: JSON.stringify({ a: 1 }) }), { params: Promise.resolve({ account_id: 'acc1' }) });
    const status = (res as unknown as { status?: number }).status;
    const body = await (res as unknown as { json: () => Promise<unknown> }).json();
    expect(status).toBe(200);
    expect(body).toHaveProperty('ok', true);
  });
});
