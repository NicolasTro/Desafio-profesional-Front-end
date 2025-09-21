import { POST } from "../route";
import { makeNextRequestMock } from "@/tests/utils/makeNextRequestMock";

const setMock = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({ set: setMock })),
}));

describe("POST /api/login", () => {
  it("should return 200 for a successful login", async () => {
    const validCredentials = {
      email: "nikprueba@user.com",
      password: "Colmillo27!",
    };

    const req = makeNextRequestMock({
      url: "http://localhost/api/login",
      method: "POST",
      body: validCredentials,
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("token");
  });

  it("should return 404 for a non-existent user", async () => {
    const invalidUser = { email: "nonexistent@user.com", password: "password" };

    const req = makeNextRequestMock({
      url: "http://localhost/api/login",
      method: "POST",
      body: invalidUser,
    });
    const res = await POST(req);

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json).toHaveProperty("error");
  });

  it("should return 401 for an incorrect password", async () => {
    const wrongPassword = {
      email: "nikprueba@user.com",
      password: "wrongpassword",
    };

    const req = makeNextRequestMock({
      url: "http://localhost/api/login",
      method: "POST",
      body: wrongPassword,
    });
    const res = await POST(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toHaveProperty("error");
  });

  it("should return 400 for a bad request", async () => {
    const req = makeNextRequestMock({
      url: "http://localhost/api/login",
      method: "POST",
      body: {},
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty("error");
  });

  it("should store token in cookies on successful login", async () => {
    const validCredentials = {
      email: "nikprueba@user.com",
      password: "Colmillo27!",
    };

    const req = makeNextRequestMock({
      url: "http://localhost/api/login",
      method: "POST",
      body: validCredentials,
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve({ token: "mocked_token" }),
      } as Response),
    );

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(setMock).toHaveBeenCalledWith("dm_token", "mocked_token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  });
});
