import { POST } from "../route";
import { makeNextRequestMock } from "@/tests/utils/makeNextRequestMock";

describe("/api/login extras (simple)", () => {
  it("returns 400 for empty body using makeNextRequestMock", async () => {
    const req = makeNextRequestMock({ url: "http://localhost/api/login", method: "POST", body: {} });
    const res = await POST(req as unknown as Request);
    expect(res.status).toBe(400);
  });

  it("returns 200 for valid known credentials", async () => {
    const req = makeNextRequestMock({
      url: "http://localhost/api/login",
      method: "POST",
      body: { email: "nikprueba@user.com", password: "Colmillo27!" },
    });
    const res = await POST(req as unknown as Request);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("token");
  });
});
