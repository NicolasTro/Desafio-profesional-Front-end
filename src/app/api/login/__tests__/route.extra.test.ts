import { POST } from '../route';
import jwt from 'jsonwebtoken';
import { makeNextRequestMock } from '@/tests/utils/makeNextRequestMock';

const jarSet = jest.fn();
jest.mock('next/headers', () => ({
  cookies: () => ({ set: jarSet }),
}));

describe('/api/login extra tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jarSet.mockClear();
    global.fetch = undefined;
  });

  it('forwards upstream text when upstream returns non-ok text', async () => {
    const mockResp1 = {
      ok: false,
      status: 401,
      headers: { get: () => 'text/html' },
      text: () => Promise.resolve('Unauthorized access'),
    } as unknown as Response;
    global.fetch = jest.fn(() => Promise.resolve(mockResp1));

  const req = makeNextRequestMock({ url: 'http://localhost', method: 'POST', body: { email: 'a', password: 'b' } });
    const res = await POST(req as unknown as Request);
    expect(res.status).toBe(401);
    const txt = await res.text();
    expect(txt).toBe('Unauthorized access');
    expect(res.headers.get('content-type')).toBe('text/html');
  });

  it('sets cookie with default maxAge when jwt.decode throws', async () => {
    const mockResp2 = {
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ token: 'abc.def.ghi' }),
    } as unknown as Response;
    global.fetch = jest.fn(() => Promise.resolve(mockResp2));

    jest.spyOn(jwt, 'decode').mockImplementation(() => {
      throw new Error('bad');
    });

  const req = makeNextRequestMock({ url: 'http://localhost', method: 'POST', body: { email: 'x', password: 'y' } });
    const res = await POST(req as unknown as Request);
    expect(res.status).toBe(200);

    expect(jarSet).toHaveBeenCalledTimes(1);
    const opts = jarSet.mock.calls[0][2];
    expect(opts).toBeDefined();
    expect(opts.maxAge).toBe(60 * 60 * 24);
  });

  it('does not set cookie when upstream returns no token', async () => {
    const mockResp3 = {
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({}),
    } as unknown as Response;
    global.fetch = jest.fn(() => Promise.resolve(mockResp3));

  const req = makeNextRequestMock({ url: 'http://localhost', method: 'POST', body: { email: 'no', password: 'token' } });
    const res = await POST(req as unknown as Request);
    expect(res.status).toBe(200);
    expect(jarSet).not.toHaveBeenCalled();
  });
});
