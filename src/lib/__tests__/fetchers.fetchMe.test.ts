import { fetchMe } from '../fetchers';

describe('fetchMe', () => {
  afterEach(() => jest.restoreAllMocks());

  it('returns user when authenticated', async () => {
    ((global as unknown) as { fetch?: unknown }).fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ authenticated: true, user: { id: 'u1', name: 'Juan' } }),
      } as unknown as Response),
    );

    const res = await fetchMe();
    expect(res).toEqual({ id: 'u1', name: 'Juan' });
  });

  it('returns null when not authenticated', async () => {
    ((global as unknown) as { fetch?: unknown }).fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ authenticated: false }),
      } as unknown as Response),
    );

    const res = await fetchMe();
    expect(res).toBeNull();
  });

  it('throws when upstream not ok', async () => {
    ((global as unknown) as { fetch?: unknown }).fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 502,
        text: () => Promise.resolve('bad'),
      } as unknown as Response),
    );

    await expect(fetchMe()).rejects.toThrow(/502|bad/);
  });
});
