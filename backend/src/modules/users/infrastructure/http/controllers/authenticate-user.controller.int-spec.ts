import { HttpIntegrationContext } from "@/common/testing/http-integration.helper";

describe("AuthenticateUserController HTTP integration tests", () => {
  const context = new HttpIntegrationContext();

  beforeAll(async () => {
    await context.start();
  });

  afterAll(async () => {
    await context.stop();
  });

  beforeEach(async () => {
    await context.clearDatabase();
  });

  it("should authenticate and return an access token", async () => {
    const { plainPassword } = await context.seedUser({
      email: "admin@school.test",
      role: "ADMINISTRATIVE",
    });

    const response = await context.request<{ access_token: string }>(
      "/auth/login",
      {
        method: "POST",
        body: {
          email: "ADMIN@SCHOOL.TEST",
          password: plainPassword,
        },
      },
    );

    expect(response.status).toBe(200);
    expect(response.body?.access_token).toEqual(expect.any(String));
  });

  it("should reject authentication with invalid credentials", async () => {
    const { user } = await context.seedUser({
      email: "admin@school.test",
    });

    const response = await context.request<{ message: string }>("/auth/login", {
      method: "POST",
      body: {
        email: user.email,
        password: "wrong-password",
      },
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Invalid credentials",
    });
  });
});
