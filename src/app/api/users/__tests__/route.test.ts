import { GET, PATCH } from '../../users/[id]/route';
import * as authModule from '@/lib/auth';

jest.mock('@/lib/auth');

describe('/api/users/[id] route', () => {
  afterEach(() => jest.restoreAllMocks());

  it('returns 401 if no token', async () => {
  jest.spyOn(authModule, 'getTokenFromCookie').mockResolvedValue(null as unknown as string | null);
  const res = await GET(new Request('/'), { params: Promise.resolve({ id: 'u1' }) });
  const status = (res as unknown as { status?: number }).status;
  expect(status).toBe(401);
  });

  it('forwards upstream user data on GET', async () => {
  jest.spyOn(authModule, 'getTokenFromCookie').mockResolvedValue('tok');
    (global as unknown as { fetch?: unknown }).fetch = jest.fn(() =>
      Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ id: 'u1', name: 'X' }) } as unknown as Response),
    );

  const res = await GET(new Request('/'), { params: Promise.resolve({ id: 'u1' }) });
  const body = await (res as unknown as { json: () => Promise<unknown> }).json();
  const statusOk = (res as unknown as { status?: number }).status;
  expect(statusOk).toBe(200);
  expect(body).toHaveProperty('id', 'u1');
  });

  it('returns upstream status when response not ok', async () => {
  jest.spyOn(authModule, 'getTokenFromCookie').mockResolvedValue('tok');
    (global as unknown as { fetch?: unknown }).fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({ error: 'not found' }) } as unknown as Response),
    );

  const res = await GET(new Request('/'), { params: Promise.resolve({ id: 'u-404' }) });
  const status404 = (res as unknown as { status?: number }).status;
  expect(status404).toBe(404);
  });

  it('PATCH forwards body and returns upstream payload', async () => {
  jest.spyOn(authModule, 'getTokenFromCookie').mockResolvedValue('tok');
    const payload = { firstname: 'A' };
    (global as unknown as { fetch?: unknown }).fetch = jest.fn(() =>
      Promise.resolve({ ok: true, status: 200, headers: new Headers({ 'content-type': 'application/json' }), json: () => Promise.resolve({ success: true }) } as unknown as Response),
    );

    const req = new Request('/', { method: 'PATCH', body: JSON.stringify(payload) });
  const res = await PATCH(req, { params: Promise.resolve({ id: 'u1' }) });
  const body = await (res as unknown as { json: () => Promise<unknown> }).json();
  const statusPatch = (res as unknown as { status?: number }).status;
  expect(statusPatch).toBe(200);
  expect(body).toHaveProperty('success', true);
  });
});
