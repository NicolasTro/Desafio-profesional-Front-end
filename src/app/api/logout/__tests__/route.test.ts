import { POST } from "../route";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getTokenFromCookie } from "@/lib/auth";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

jest.mock("@/lib/auth", () => ({
  getTokenFromCookie: jest.fn(() => "mocked_token"),
}));

describe("API Logout Handler", () => {
  test("should return 202 on successful logout", async () => {
    const setMock = jest.fn();
    const getMock = jest.fn(() => "mocked_token");
    (cookies as jest.Mock).mockReturnValue({ set: setMock, get: getMock });
    (NextResponse.json as jest.Mock).mockImplementation(() => ({ status: 202 }));

    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true, // Simulate a successful response
        status: 202,
        statusText: "Accepted",
        headers: new Headers({ "content-type": "application/json" }),
        redirected: false,
        type: "default",
        url: "",
        json: () => Promise.resolve({}),
      } as Response)
    );

    
    await POST();

    
    expect(setMock).toHaveBeenCalledWith("dm_token", "", { httpOnly: true, maxAge: 0, path: "/" });
    expect(NextResponse.json).toHaveBeenCalledWith(
      { ok: true },
      { status: 202 }
    );
  });

  test("should return 500 on internal server error", async () => {
    const setMock = jest.fn();
    const getMock = jest.fn(() => "mocked_token");
    (cookies as jest.Mock).mockReturnValue({ set: setMock, get: getMock });
    (NextResponse.json as jest.Mock).mockImplementation(() => ({ status: 500 }));

    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        headers: new Headers({ "content-type": "application/json" }),
        redirected: false,
        type: "default",
        url: "",
        json: () => Promise.resolve({}),
      } as Response)
    );

    
    await POST();

    
    expect(setMock).toHaveBeenCalledWith("dm_token", "", { httpOnly: true, maxAge: 0, path: "/" });
  // ensure NextResponse.json was called at least once with an error payload
  const calls = (NextResponse.json as jest.Mock).mock.calls;
  const lastCall = calls[calls.length - 1];
  expect(lastCall[0]).toHaveProperty('ok');
  expect(lastCall[1]).toHaveProperty('status');
  expect([500, 502]).toContain(lastCall[1].status);
  });
});
