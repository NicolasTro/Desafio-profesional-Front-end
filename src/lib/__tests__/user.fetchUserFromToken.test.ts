import jwt from 'jsonwebtoken';
import fetchUserFromToken from '../user';

describe('fetchUserFromToken', () => {
  afterEach(() => jest.restoreAllMocks());

  it('throws when token cannot be decoded', async () => {
    jest.spyOn(jwt, 'decode').mockImplementation(() => null as unknown);
    await expect(fetchUserFromToken('bad')).rejects.toThrow(/Token inválido/);
  });

  it('fetches user data when token decodes to user id', async () => {
  jest.spyOn(jwt, 'decode').mockReturnValue({ user_id: 'u1' } as unknown as Record<string, unknown>);
    (global as unknown as { fetch?: unknown }).fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 'u1', firstname: 'Juan', lastname: 'Perez' }),
      } as unknown as Response),
    );

    const res = await fetchUserFromToken('token123');
    expect(res.id).toBe('u1');
    expect(res.name).toBe('Juan');
  });

  it('throws upstream error when fetch not ok', async () => {
  jest.spyOn(jwt, 'decode').mockReturnValue({ user_id: 'u2' } as unknown as Record<string, unknown>);
    (global as unknown as { fetch?: unknown }).fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 404, text: () => Promise.resolve('not found') } as unknown as Response),
    );

    await expect(fetchUserFromToken('token2')).rejects.toMatchObject({ status: 404 });
  });
});
