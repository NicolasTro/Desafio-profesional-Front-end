import { GET } from '../route';
import * as auth from '@/lib/auth';
import jwt from 'jsonwebtoken';

describe('/api/account extra tests', () => {
  afterEach(() => jest.restoreAllMocks());

  it('returns 401 when no token', async () => {
    jest.spyOn(auth, 'getTokenFromCookie').mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns 401 when jwt.decode throws', async () => {
    jest.spyOn(auth, 'getTokenFromCookie').mockResolvedValue('tok');
    jest.spyOn(jwt, 'decode').mockImplementation(() => { throw new Error('bad'); });
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns 401 when no user id in token', async () => {
    jest.spyOn(auth, 'getTokenFromCookie').mockResolvedValue('tok');
    jest.spyOn(jwt, 'decode').mockReturnValue({});
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('forwards upstream error', async () => {
    jest.spyOn(auth, 'getTokenFromCookie').mockResolvedValue('tok');
    jest.spyOn(jwt, 'decode').mockReturnValue({ username: 'u1' });
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 502, text: () => Promise.resolve('ext err') } as Response));
    const res = await GET();
    expect(res.status).toBe(502);
  });
});
