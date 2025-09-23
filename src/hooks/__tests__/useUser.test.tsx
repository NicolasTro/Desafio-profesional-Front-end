import { renderHook, act, waitFor } from '@testing-library/react';
import { useUser } from '../useUser';

jest.mock('../../lib/fetchers', () => ({
  fetchMe: jest.fn(),
}));

import { fetchMe } from '../../lib/fetchers';

describe('useUser hook', () => {
  it('loads user data and exposes refetch', async () => {
    const fakeUser = { id: '1', name: 'Ana' };
    (fetchMe as jest.Mock).mockResolvedValueOnce(fakeUser);

  const { result } = renderHook(() => useUser());

  // initial
  expect(result.current.isLoading).toBe(true);
  // wait for effect to finish
  await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(fakeUser);

    // test refetch
    const another = { id: '2', name: 'Beto' };
    (fetchMe as jest.Mock).mockResolvedValueOnce(another);
    await act(async () => {
      const res = await result.current.refetch();
      expect(res).toEqual(another);
    });
  });
});
