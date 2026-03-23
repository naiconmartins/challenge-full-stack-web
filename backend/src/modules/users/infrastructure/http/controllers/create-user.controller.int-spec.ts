import { dataSource } from "@/common/infrastructure/typeorm";
import { env } from "@/common/infrastructure/env";
import { HttpIntegrationContext } from "@/common/testing/http-integration.helper";
import jwt from "jsonwebtoken";
import { User } from "../../typeorm/entities/users.entity";

describe("CreateUserController HTTP integration tests", () => {
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

  it("should allow an administrative user to create a user", async () => {
    const { user: admin, plainPassword } = await context.seedUser({
      email: "admin@school.test",
      role: "ADMINISTRATIVE",
    });
    const token = await context.login({
      email: admin.email,
      password: plainPassword,
    });

    const response = await context.request<{
      id: string;
      name: string;
      email: string;
      role: string;
      password?: string;
    }>("/users", {
      method: "POST",
      token,
      body: {
        name: "  Maria Admin  ",
        email: "MARIA.ADMIN@SCHOOL.TEST",
        password: "123456",
        role: "ADMINISTRATIVE",
      },
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: "Maria Admin",
      email: "maria.admin@school.test",
      role: "ADMINISTRATIVE",
    });
    expect(response.body).not.toHaveProperty("password");

    const storedUser = await dataSource.getRepository(User).findOneByOrFail({
      email: "maria.admin@school.test",
    });

    expect(storedUser.password).not.toBe("123456");
  });

  it("should reject user creation without authentication", async () => {
    const response = await context.request<{ message: string }>("/users", {
      method: "POST",
      body: {
        name: "Maria Admin",
        email: "maria.admin@school.test",
        password: "123456",
        role: "ADMINISTRATIVE",
      },
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Token is missing",
    });
  });

  it("should reject user creation for non administrative users", async () => {
    const { user } = await context.seedUser({
      email: "teacher@school.test",
    });
    const token = jwt.sign({ role: "TEACHER" }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
      subject: user.id,
    });

    const response = await context.request<{ message: string }>("/users", {
      method: "POST",
      token,
      body: {
        name: "Maria Admin",
        email: "maria.admin@school.test",
        password: "123456",
        role: "ADMINISTRATIVE",
      },
    });

    expect(response.status).toBe(403);
    expect(response.body).toMatchObject({
      message: "User does not have permission",
    });
  });

  it("should validate the request body before creating a user", async () => {
    const { user: admin, plainPassword } = await context.seedUser({
      email: "admin@school.test",
      role: "ADMINISTRATIVE",
    });
    const token = await context.login({
      email: admin.email,
      password: plainPassword,
    });

    const response = await context.request<{
      message: string;
      errors: Array<{ field: string; message: string }>;
    }>("/users", {
      method: "POST",
      token,
      body: {
        name: "   ",
        email: "invalid-email",
        password: "123",
        role: "ADMINISTRATIVE",
      },
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      message: "Validation failed",
      errors: [
        { field: "name", message: "Name is required" },
        { field: "email", message: "Invalid email" },
        {
          field: "password",
          message: "Password must be at least 6 characters",
        },
      ],
    });
  });

  it("should reject duplicate user emails", async () => {
    const { user: admin, plainPassword } = await context.seedUser({
      email: "admin@school.test",
      role: "ADMINISTRATIVE",
    });
    await context.seedUser({
      email: "duplicate@school.test",
    });
    const token = await context.login({
      email: admin.email,
      password: plainPassword,
    });

    const response = await context.request<{ message: string }>("/users", {
      method: "POST",
      token,
      body: {
        name: "Another User",
        email: "DUPLICATE@SCHOOL.TEST",
        password: "123456",
        role: "ADMINISTRATIVE",
      },
    });

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      message: "Email already used on another user",
    });
  });
});
