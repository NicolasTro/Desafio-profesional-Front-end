import { apiFetch } from '../http';

describe('apiFetch', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns parsed JSON when content-type includes application/json and ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' } as any,
        json: () => Promise.resolve({ hello: 'world' }),
      } as Response)
    );

    const res = await apiFetch('/api/ping');
    expect(res).toEqual({ hello: 'world' });
  });

  it('returns text when content-type is not json and ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => 'text/plain' } as any,
        text: () => Promise.resolve('pong'),
      } as Response)
    );

    const res = await apiFetch('/api/ping');
    expect(res).toBe('pong');
  });

  it('throws when response is not ok and includes status in message', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 502,
        headers: { get: () => 'text/plain' } as any,
        text: () => Promise.resolve('bad gateway'),
      } as Response)
    );

    await expect(apiFetch('/api/fail')).rejects.toThrow(/502/);
  });
});
