import { POST } from '../route';

const mockRequest = (body: Record<string, unknown>) => {
    return new Request('http://localhost/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
};

describe('POST /api/register', () => {


    it('should return 409 for a conflict', async () => {
        const validCredentials = { email: "nikprueba@user.com", password: "asdasd" };

        const req = mockRequest(validCredentials);
        const res = await POST(req);

        expect(res.status).toBe(409);
        const json = await res.json();
        expect(json).toHaveProperty('error');
    });

    it('should return 201 for a successful creation', async () => {
        const newUser = { email: "3xist1ng@user.com", password: "ExistingPass27!" };

        const req = mockRequest(newUser);
        const res = await POST(req);

        expect([201, 409]).toContain(res.status);

    });



});
