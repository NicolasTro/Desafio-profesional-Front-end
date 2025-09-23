// Minimal polyfills so next/server and web spec code can import Request/Response/Headers
if (typeof global.Request === 'undefined') {
  global.Request = function Request(input, init) {
    this.input = input;
    this.init = init || {};
    // capture body if provided
    this.body = this.init.body;
    this.headers = this.init.headers || {};
    this.method = (this.init.method || 'GET').toUpperCase();
    this.url = typeof input === 'string' ? input : (input && input.url) || '';
    // provide json/text helpers commonly used by route handlers
    this.json = async () => {
      if (this.body === undefined || this.body === null) return {};
      if (typeof this.body === 'string') {
        try {
          return JSON.parse(this.body);
        } catch (e) {
          return this.body;
        }
      }
      return this.body;
    };
    this.text = async () => {
      if (this.body === undefined || this.body === null) return '';
      return typeof this.body === 'string' ? this.body : JSON.stringify(this.body);
    };
  };
}
if (typeof global.Response === 'undefined') {
  global.Response = function Response(body, init) {
    this.body = body;
    this.init = init || {};
    this.status = this.init.status || 200;
    this.headers = this.init.headers || {};
    this.json = async () => {
      if (typeof this.body === 'string') {
        try {
          return JSON.parse(this.body);
        } catch (e) {
          return this.body;
        }
      }
      return this.body;
    };
    this.text = async () => (typeof this.body === 'string' ? this.body : JSON.stringify(this.body));
  };
}
if (typeof global.Headers === 'undefined') {
  global.Headers = function Headers(init) {
    this.map = {};
    if (init && typeof init === 'object') {
      for (const k of Object.keys(init)) this.map[k.toLowerCase()] = init[k];
    }
    this.get = (k) => this.map[k.toLowerCase()];
    this.append = (k, v) => { this.map[k.toLowerCase()] = v; };
  };
}
