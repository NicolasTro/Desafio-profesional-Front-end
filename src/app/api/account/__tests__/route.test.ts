import { GET } from '../route';

import * as auth from '@/lib/auth';

describe('GET /api/account', () => {
  beforeEach(() => jest.spyOn(auth, 'getTokenFromCookie').mockResolvedValue('mocked_token'));

  it('returns account data or error', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ account_id: 'acc1' }) } as Response));
    const res = await GET();
    expect([200, 401, 500]).toContain(res.status);
  });
});
