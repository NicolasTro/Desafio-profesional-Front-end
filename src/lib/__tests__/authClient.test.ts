import * as authClient from '../authClient';

describe('authClient helpers', () => {
  beforeEach(() => {
    // clean storages
    Object.defineProperty(window, 'sessionStorage', { value: sessionStorage });
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = '';
  });

  it('hasAuthCookie returns true when cookie present', () => {
    document.cookie = 'dm_token=abc123; path=/';
    expect(authClient.hasAuthCookie()).toBe(true);
  });

  it('get/set/clear cached profile', () => {
    const profile = { id: 'u1', name: 'A', lastname: 'B', email: 'a@b', phone: null } as const;
    authClient.setCachedProfile(profile);
    const cached = authClient.getCachedProfile();
    expect(cached).toBeTruthy();
    expect(cached?.id).toBe('u1');

    authClient.clearCachedProfile();
    expect(authClient.getCachedProfile()).toBeNull();
  });
});
