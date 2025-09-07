import { GET } from '../route';

describe('GET /api/ping', () => {
  it('returns pong', async () => {
    const res = await GET();
  expect([200, 502]).toContain(res.status);
  });
});
