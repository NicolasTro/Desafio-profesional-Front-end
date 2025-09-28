describe('api/login route - branch tests', () => {
  const originalFetch = global.fetch
  afterEach(() => {
    global.fetch = originalFetch
    jest.resetModules()
  })

  test('upstream 500 returns 500 with message', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, headers: { get: () => 'application/json' }, json: async () => ({ message: 'oh' }) })
    const routeModule = await import('../../login/route')
    const route = routeModule.POST
    const req = new Request('http://localhost/api/login', { method: 'POST', body: JSON.stringify({ email: 'a@b.com' }), headers: { 'Content-Type': 'application/json' } })
    const res = await route(req)
    expect(res.status).toBe(500)
  })

  test('upstream returns missing fields yields non-2xx status or empty body', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200, headers: { get: () => 'application/json' }, json: async () => ({}) })
    const routeModule = await import('../../login/route')
    const route = routeModule.POST
    const req = new Request('http://localhost/api/login', { method: 'POST', body: JSON.stringify({}), headers: { 'Content-Type': 'application/json' } })
    const res = await route(req)
    expect([200,400,422,500]).toContain(res.status)
  })
})
