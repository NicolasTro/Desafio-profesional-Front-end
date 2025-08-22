import { POST } from '../route';

const mockRequest = (body) => {
  return new Request('http://localhost/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

describe('POST /api/login', () => {
  it('should return 500 for a internal server error', async () => {
    const validCredentials = { email: "nikprueba@user.com", password: "Colmillo27!" };

    const req = mockRequest(validCredentials);
    const res = await POST(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toHaveProperty('error');
  });

  it('should return 404 for a non-existent user', async () => {
    const invalidUser = { email: 'nonexistent@user.com', password: 'password' };

    const req = mockRequest(invalidUser);
    const res = await POST(req);

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json).toHaveProperty('error');
  });

  it('should return 401 for an incorrect password', async () => {
    const wrongPassword = { email: 'nikprueba@user.com', password: 'wrongpassword' };

    const req = mockRequest(wrongPassword);
    const res = await POST(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toHaveProperty('error');
  });

  it('should return 400 for a bad request', async () => {
    const req = mockRequest({}); // Simulate an empty request body
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty('error');
  });
});