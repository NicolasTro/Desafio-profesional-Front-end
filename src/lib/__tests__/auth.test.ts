import * as auth from '../auth';
import jwt from 'jsonwebtoken';

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({ get: (name: string) => ({ value: 'token123' }) })),
}));

describe('auth helpers', () => {
  afterEach(() => jest.restoreAllMocks());

  it('getTokenFromCookie returns token when cookie present', async () => {
    const token = await auth.getTokenFromCookie();
    expect(token).toBe('token123');
  });

  it('getDecodedTokenFromCookie returns decoded data when token decodes', async () => {
    jest
      .spyOn(jwt, 'decode')
      .mockReturnValue({ user_id: 'u1', email: 'a@b.com', exp: 999999 } as unknown as { user_id: string; email: string; exp: number });
    const decoded = await auth.getDecodedTokenFromCookie();
    expect(decoded).toHaveProperty('id');
  });
});
