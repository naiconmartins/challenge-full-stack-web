import { HttpIntegrationContext } from "@/common/testing/http-integration.helper";

describe("LogoutUserController HTTP integration tests", () => {
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

  it("should revoke the token on logout and reject it afterwards", async () => {
    const { user, plainPassword } = await context.seedUser({
      email: "admin@school.test",
      role: "ADMINISTRATIVE",
    });
    const token = await context.login({
      email: user.email,
      password: plainPassword,
    });

    const logoutResponse = await context.request("/auth/logout", {
      method: "POST",
      token,
    });

    expect(logoutResponse.status).toBe(204);
    expect(await context.countRevokedTokens(token)).toBe(1);

    const meResponse = await context.request<{ message: string }>("/auth/me", {
      token,
    });

    expect(meResponse.status).toBe(401);
    expect(meResponse.body).toMatchObject({
      message: "Token has been revoked",
    });
  });
});
