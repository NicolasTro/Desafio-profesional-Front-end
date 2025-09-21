import { GET, POST } from "../route";
import {
  makeNextRequestMock,
  makeRouteParams,
} from "@/tests/utils/makeNextRequestMock";
import * as auth from "@/lib/auth";

describe("/api/accounts/[account_id]/cards extra tests", () => {
  afterEach(() => jest.restoreAllMocks());

  it("GET returns 401 when no token", async () => {
    jest.spyOn(auth, "getTokenFromCookie").mockResolvedValue(null);
    const req = makeNextRequestMock({ url: "http://localhost" });
    const res = await GET(req, makeRouteParams({ account_id: "1" }));
    expect(res.status).toBe(401);
  });

  it("GET returns 500 when fetch throws", async () => {
    jest.spyOn(auth, "getTokenFromCookie").mockResolvedValue("tok");
    global.fetch = jest.fn(() => Promise.reject(new Error("network")));
    const req = makeNextRequestMock({ url: "http://localhost" });
    const res = await GET(req, makeRouteParams({ account_id: "1" }));
    expect(res.status).toBe(500);
  });

  it("POST returns 401 when no token", async () => {
    jest.spyOn(auth, "getTokenFromCookie").mockResolvedValue(null);
    const req = makeNextRequestMock({
      url: "http://localhost",
      method: "POST",
      body: {},
    });
    const res = await POST(req, makeRouteParams({ account_id: "1" }));
    expect(res.status).toBe(401);
  });

  it("POST returns 500 when fetch throws", async () => {
    jest.spyOn(auth, "getTokenFromCookie").mockResolvedValue("tok");
    global.fetch = jest.fn(() => Promise.reject(new Error("boom")));
    const req = makeNextRequestMock({
      url: "http://localhost",
      method: "POST",
      body: {},
    });
    const res = await POST(req, makeRouteParams({ account_id: "1" }));
    expect(res.status).toBe(500);
  });

  it("POST forwards upstream non-json error text", async () => {
    jest.spyOn(auth, "getTokenFromCookie").mockResolvedValue("tok");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        text: () => Promise.resolve("<html>error</html>"),
      } as Response),
    );
    const req = makeNextRequestMock({
      url: "http://localhost",
      method: "POST",
      body: {},
    });
    const res = await POST(req, makeRouteParams({ account_id: "1" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty("error");
  });
});
