import { HttpIntegrationContext } from "@/common/testing/http-integration.helper";

describe("GetMeController HTTP integration tests", () => {
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

  it("should return the authenticated user", async () => {
    const { user, plainPassword } = await context.seedUser({
      email: "admin@school.test",
      role: "ADMINISTRATIVE",
    });
    const token = await context.login({
      email: user.email,
      password: plainPassword,
    });

    const response = await context.request<{
      id: string;
      name: string;
      email: string;
      role: string;
      password?: string;
    }>("/auth/me", {
      token,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    expect(response.body).not.toHaveProperty("password");
  });

  it("should require an access token", async () => {
    const response = await context.request<{ message: string }>("/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Token is missing",
    });
  });
});
