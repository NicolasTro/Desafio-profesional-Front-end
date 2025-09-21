import { GET } from "../route";
import * as auth from "@/lib/auth";
import jwt from "jsonwebtoken";

describe("/api/me extra tests", () => {
  afterEach(() => jest.restoreAllMocks());

  it("returns 401 when no token", async () => {
    jest.spyOn(auth, "getTokenFromCookie").mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns 400 when jwt.decode throws", async () => {
    jest.spyOn(auth, "getTokenFromCookie").mockResolvedValue("tok");
    jest.spyOn(jwt, "decode").mockImplementation(() => {
      throw new Error("bad");
    });
    const res = await GET();
    expect(res.status).toBe(400);
  });

  it("returns 400 when decoded token lacks user id", async () => {
    jest.spyOn(auth, "getTokenFromCookie").mockResolvedValue("tok");
    jest.spyOn(jwt, "decode").mockReturnValue({});
    const res = await GET();
    expect(res.status).toBe(400);
  });

  it("forwards upstream error status", async () => {
    jest.spyOn(auth, "getTokenFromCookie").mockResolvedValue("tok");
    jest.spyOn(jwt, "decode").mockReturnValue({ user_id: "u1" });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        text: () => Promise.resolve("bad"),
      } as Response),
    );
    const res = await GET();
    expect(res.status).toBe(500);
  });
});
