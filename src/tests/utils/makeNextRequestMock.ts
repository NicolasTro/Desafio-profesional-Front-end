import { NextRequest } from 'next/server';

export function makeNextRequestMock(init?: { url?: string; method?: string; body?: unknown }): NextRequest {
  const url = init?.url || 'http://localhost';
  const method = (init?.method || 'GET').toUpperCase();
  const body = init?.body;

  const req = new Request(url, { method, body: body ? JSON.stringify(body) : undefined });

  // attach a cookies helper to mimic NextRequest shape in tests if needed
  // attach cookies shim (typed as unknown->object to avoid `any` usage)
  (req as unknown as { cookies?: () => { get: () => undefined } }).cookies = () => ({ get: () => undefined });

  // The runtime handlers expect NextRequest; cast the Request to NextRequest for tests.
  return req as unknown as NextRequest;
}

export function makeRouteParams<T extends Record<string, string>>(params: T) {
  return { params: Promise.resolve(params) } as { params: Promise<T> };
}
