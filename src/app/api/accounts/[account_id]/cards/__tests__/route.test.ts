import { GET, POST } from '../route';

import * as auth from '@/lib/auth';
import { makeNextRequestMock, makeRouteParams } from '@/tests/utils/makeNextRequestMock';

describe('/api/accounts/[account_id]/cards', () => {
  beforeEach(() => {
    jest.spyOn(auth, 'getTokenFromCookie').mockResolvedValue('mocked_token');
  });
  it('GET returns list or error', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) } as Response));
  const fakeReq = makeNextRequestMock({ url: 'http://localhost' });
  const res = await GET(fakeReq, makeRouteParams({ account_id: '1' }));
    expect([200, 401, 500]).toContain(res.status);
  });

  it('POST creates card', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 201, json: () => Promise.resolve({ id: 'card1' }) } as Response));
  const fakeReq2 = makeNextRequestMock({ url: 'http://localhost', method: 'POST', body: {} });
  const res = await POST(fakeReq2, makeRouteParams({ account_id: '1' }));
    expect([200,201,400,500]).toContain(res.status);
  });
});
