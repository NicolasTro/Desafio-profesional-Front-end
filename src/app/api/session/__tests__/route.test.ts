import { GET } from '../route';
import * as auth from '@/lib/auth';

describe('GET /api/session', () => {
  afterEach(() => jest.restoreAllMocks());

  it('returns authenticated when token present', async () => {
    jest.spyOn(auth, 'getTokenFromCookie').mockResolvedValue('mocked_token');
    jest.spyOn(auth, 'getDecodedTokenFromCookie').mockResolvedValue({ id: '1', email: 'a@b.com', exp: 123456 });

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('authenticated');
  });
});
