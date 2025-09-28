import { GET } from "../route";
// ...existing code... (removed unused helper import)
import * as auth from "@/lib/auth";

describe("/api/session - coverage tests", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    (global as unknown as { fetch?: unknown }).fetch = jest.fn();
  });

  it("parses user and account when both upstream ok", async () => {
    jest.spyOn(auth, "getTokenFromCookie").mockResolvedValueOnce("tok");
    jest.spyOn(auth, "getDecodedTokenFromCookie").mockResolvedValueOnce({ id: "42", exp: Math.floor(Date.now()/1000) + 1000 });

    const userResp = {
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ id: "42", firstname: "Juan", lastname: "Lopez", email: "j@l.com", phone: "123", dni: "321" }),
    } as unknown as Response;

    const accountResp = {
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ account_id: "acc-1", cvu: "cvu", alias: "alias", available_amount: 100 }),
    } as unknown as Response;

    (global as unknown as { fetch?: unknown }).fetch = jest.fn(() => Promise.resolve(userResp)).mockImplementationOnce(() => Promise.resolve(userResp)).mockImplementationOnce(() => Promise.resolve(accountResp));

  const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.authenticated).toBe(true);
    expect(body.user).toBeTruthy();
    expect(body.account).toBeTruthy();
  });

  it("handles missing user but account present", async () => {
    jest.spyOn(auth, "getTokenFromCookie").mockResolvedValueOnce("tok");
    jest.spyOn(auth, "getDecodedTokenFromCookie").mockResolvedValueOnce({ id: "99", exp: Math.floor(Date.now()/1000) + 1000 });

    const userResp = { ok: false, status: 404, headers: new Headers({}), json: async () => ({}) } as unknown as Response;
    const accountResp = {
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ id: "99", balance: 50 }),
    } as unknown as Response;

    (global as unknown as { fetch?: unknown }).fetch = jest.fn().mockImplementationOnce(() => Promise.resolve(userResp)).mockImplementationOnce(() => Promise.resolve(accountResp));

  const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.authenticated).toBe(true);
    expect(body.user).toBeNull();
    expect(body.account).toBeTruthy();
  });

  it("returns 500 when fetch throws", async () => {
    jest.spyOn(auth, "getTokenFromCookie").mockResolvedValueOnce("tok");
    jest.spyOn(auth, "getDecodedTokenFromCookie").mockResolvedValueOnce({ id: "1", exp: Math.floor(Date.now()/1000) + 1000 });

    (global as unknown as { fetch?: unknown }).fetch = jest.fn(() => Promise.reject(new Error("network")));

  const res = await GET();
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.authenticated).toBe(false);
    expect(body.error).toBe("network");
  });

  it("ignores user when response json has no id", async () => {
    jest.spyOn(auth, "getTokenFromCookie").mockResolvedValueOnce("tok");
    jest.spyOn(auth, "getDecodedTokenFromCookie").mockResolvedValueOnce({ id: "2", exp: Math.floor(Date.now()/1000) + 1000 });

    const userResp = {
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ firstname: "NoId" }),
    } as unknown as Response;

    const accountResp = {
      ok: false,
      status: 404,
      headers: new Headers({}),
      json: async () => ({}),
    } as unknown as Response;

    (global as unknown as { fetch?: unknown }).fetch = jest.fn().mockImplementationOnce(() => Promise.resolve(userResp)).mockImplementationOnce(() => Promise.resolve(accountResp));

  const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user).toBeNull();
    expect(body.account).toBeNull();
  });
});
