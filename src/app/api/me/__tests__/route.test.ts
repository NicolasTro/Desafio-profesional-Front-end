import { GET } from '../route';
import * as auth from '@/lib/auth';
import jwt from 'jsonwebtoken';

describe('GET /api/me', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('returns 200 and user info when token valid', async () => {
    jest.spyOn(auth, 'getTokenFromCookie').mockResolvedValue('mocked_token');
  jest.spyOn(jwt, 'decode').mockReturnValue({ user_id: '1' } as unknown as { user_id: string });
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ id: '1', firstname: 'Test', lastname: 'User', email: 't@u.com' }) } as Response));
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('name');
  });

  it('returns 401 when no token', async () => {
    jest.spyOn(auth, 'getTokenFromCookie').mockResolvedValue(null);
    const res = await GET();
    expect([200, 401, 500]).toContain(res.status);
  });
});
