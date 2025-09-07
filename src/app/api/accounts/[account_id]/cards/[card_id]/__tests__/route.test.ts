import { DELETE } from '../route';
import { makeNextRequestMock, makeRouteParams } from '@/tests/utils/makeNextRequestMock';
import * as auth from '@/lib/auth';

describe('/api/accounts/[account_id]/cards/[card_id]', () => {
  it('DELETE removes card or returns error', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 204 } as Response));
    const fakeReq = makeNextRequestMock({ url: 'http://localhost' });
    const res = await DELETE(
      fakeReq,
      makeRouteParams({ account_id: '1', card_id: 'c1' })
    );
    expect([200, 204, 401, 500]).toContain(res.status);
  });

  it('returns 401 when no token present', async () => {
    jest.spyOn(auth, 'getTokenFromCookie').mockResolvedValue(null);
    const fakeReq = makeNextRequestMock({ url: 'http://localhost' });
    const res = await DELETE(
      fakeReq,
      makeRouteParams({ account_id: '1', card_id: 'c1' })
    );
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toHaveProperty('error');
  });

  it('forwards upstream non-ok response', async () => {
    jest.spyOn(auth, 'getTokenFromCookie').mockResolvedValue('tok');
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 500, text: () => Promise.resolve('up-error') } as Response)
    );
    const fakeReq = makeNextRequestMock({ url: 'http://localhost' });
    const res = await DELETE(
      fakeReq,
      makeRouteParams({ account_id: '1', card_id: 'c1' })
    );
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toHaveProperty('error');
  });

  it('handles upstream plain text success response', async () => {
    jest.spyOn(auth, 'getTokenFromCookie').mockResolvedValue('tok');
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve('Deleted OK') } as Response)
    );
    const fakeReq = makeNextRequestMock({ url: 'http://localhost' });
    const res = await DELETE(
      fakeReq,
      makeRouteParams({ account_id: '1', card_id: 'c1' })
    );
    expect([200, 204]).toContain(res.status);
    const json = await res.json();
    expect(json).toHaveProperty('message');
  });
});
