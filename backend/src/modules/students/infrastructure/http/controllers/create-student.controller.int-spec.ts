import { HttpIntegrationContext } from "@/common/testing/http-integration.helper";

describe("CreateStudentController HTTP integration tests", () => {
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

  it("should create a student, normalize fields and persist created_by", async () => {
    const { user, plainPassword } = await context.seedUser({
      email: "admin@school.test",
    });
    const token = await context.login({
      email: user.email,
      password: plainPassword,
    });

    const response = await context.request<{
      id: string;
      name: string;
      email: string;
      cpf: string;
      created_by: string;
      updated_by: string | null;
    }>("/students", {
      method: "POST",
      token,
      body: {
        ra: "20240001",
        name: "  maria   da   silva  ",
        email: "MARIA.SILVA@ALUNO.EDU.BR",
        cpf: "416.417.200-26",
      },
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      ra: "20240001",
      name: "Maria Da Silva",
      email: "maria.silva@aluno.edu.br",
      cpf: "41641720026",
      created_by: user.id,
      updated_by: null,
    });
  });

  it("should reject student creation when the email already exists with different casing", async () => {
    const { user, plainPassword } = await context.seedUser({
      email: "admin@school.test",
    });
    const token = await context.login({
      email: user.email,
      password: plainPassword,
    });
    await context.seedStudent({
      email: "student.one@aluno.edu.br",
      cpf: "41641720026",
      ra: "20240001",
    });

    const response = await context.request<{ message: string }>("/students", {
      method: "POST",
      token,
      body: {
        ra: "20240002",
        name: "Maria Da Silva",
        email: "STUDENT.ONE@ALUNO.EDU.BR",
        cpf: "308.307.270-86",
      },
    });

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      message: "A student with this email already exists",
    });
  });

  it("should reject student creation when the cpf already exists in another format", async () => {
    const { user, plainPassword } = await context.seedUser({
      email: "admin@school.test",
    });
    const token = await context.login({
      email: user.email,
      password: plainPassword,
    });
    await context.seedStudent({
      email: "student.one@aluno.edu.br",
      cpf: "41641720026",
      ra: "20240001",
    });

    const response = await context.request<{ message: string }>("/students", {
      method: "POST",
      token,
      body: {
        ra: "20240002",
        name: "Maria Da Silva",
        email: "student.two@aluno.edu.br",
        cpf: "416.417.200-26",
      },
    });

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      message: "A student with this CPF already exists",
    });
  });

  it("should validate the student payload", async () => {
    const { user, plainPassword } = await context.seedUser({
      email: "admin@school.test",
    });
    const token = await context.login({
      email: user.email,
      password: plainPassword,
    });

    const response = await context.request<{
      message: string;
      errors: Array<{ field: string; message: string }>;
    }>("/students", {
      method: "POST",
      token,
      body: {
        ra: "20240001",
        name: "Maria",
        email: "invalid-email",
        cpf: "111.111.111-11",
      },
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      message: "Validation failed",
      errors: [
        { field: "name", message: "Full name is required" },
        { field: "email", message: "Invalid email" },
        { field: "cpf", message: "Invalid CPF" },
      ],
    });
  });
});
