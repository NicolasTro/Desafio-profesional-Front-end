// Minimal mock of NextResponse.json used by the app routes in tests
// Minimal mock that supports both `new NextResponse(body, init)` and
// `NextResponse.json(body, init)` usage patterns from the app routes.
function _buildResponse(body, init) {
  const status = init && init.status ? init.status : 200;
  const headers = (init && init.headers) || {};
  // Try to delegate cookie operations to the next/headers mock if available
  let cookieJar = null;
  try {
    const nh = require('next/headers');
    if (nh && typeof nh.cookies === 'function') {
      cookieJar = nh.cookies();
    }
  } catch (e) {
    cookieJar = null;
  }

  return {
    status,
    headers: {
      get: (k) => headers[k] || headers[k.toLowerCase()] || null,
    },
    json: async () => body,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
    cookies: {
      set: (...args) => {
        if (cookieJar && typeof cookieJar.set === 'function') return cookieJar.set(...args);
        // fallback: noop
        return null;
      },
    },
  };
}

function NextResponse(body, init) {
  if (!(this instanceof NextResponse)) {
    return _buildResponse(body, init);
  }
  const r = _buildResponse(body, init);
  Object.assign(this, r);
}

NextResponse.json = (body, init) => _buildResponse(body, init);

module.exports = { NextResponse };
