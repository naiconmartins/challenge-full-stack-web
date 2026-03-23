import { HttpIntegrationContext } from "@/common/testing/http-integration.helper";

describe("GetStudentController HTTP integration tests", () => {
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

  it("should return the student by id", async () => {
    const { user, plainPassword } = await context.seedUser({
      email: "admin@school.test",
    });
    const token = await context.login({
      email: user.email,
      password: plainPassword,
    });
    const student = await context.seedStudent({
      ra: "20240001",
      name: "Maria Clara Souza",
      email: "maria@aluno.edu.br",
      cpf: "41641720026",
      created_by: user.id,
    });

    const response = await context.request<{
      id: string;
      name: string;
      email: string;
      ra: string;
      cpf: string;
    }>(`/students/${student.id}`, {
      token,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: student.id,
      name: student.name,
      email: student.email,
      ra: student.ra,
      cpf: student.cpf,
    });
  });

  it("should validate route params", async () => {
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
    }>("/students/invalid-uuid", {
      token,
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      message: "Validation failed",
      errors: [{ field: "id", message: "Id must be a valid UUID" }],
    });
  });

  it("should return 404 when the student does not exist", async () => {
    const { user, plainPassword } = await context.seedUser({
      email: "admin@school.test",
    });
    const token = await context.login({
      email: user.email,
      password: plainPassword,
    });

    const response = await context.request<{ message: string }>(
      "/students/6f6261b7-5396-4ee8-8d8a-2bf18e9cb001",
      {
        token,
      },
    );

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      message: "Student not found using ID 6f6261b7-5396-4ee8-8d8a-2bf18e9cb001",
    });
  });
});
