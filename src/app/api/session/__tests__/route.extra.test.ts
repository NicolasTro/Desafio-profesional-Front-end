import { GET } from "../route";
import * as auth from "@/lib/auth";

describe("/api/session - extra", () => {
  afterEach(() => jest.restoreAllMocks());

  it("returns not authenticated when no token", async () => {
    jest.spyOn(auth, "getTokenFromCookie").mockResolvedValueOnce(null);
    const res = await GET();
    const body = await res.json();
    expect(body.authenticated).toBe(false);
    expect(body.user).toBeNull();
  });

  it("returns expired when token expired", async () => {
    jest.spyOn(auth, "getTokenFromCookie").mockResolvedValueOnce("tok");
    jest.spyOn(auth, "getDecodedTokenFromCookie").mockResolvedValueOnce({ id: "1", exp: 1 });
    const res = await GET();
    const body = await res.json();
    expect(body.authenticated).toBe(false);
    expect(body.exp).toBe(1);
  });
});
