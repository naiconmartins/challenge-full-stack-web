import { HttpIntegrationContext } from "@/common/testing/http-integration.helper";

describe("UpdateStudentController HTTP integration tests", () => {
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

  it("should update the student and persist updated_by", async () => {
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
      updated_by: string;
    }>(`/students/${student.id}`, {
      method: "PUT",
      token,
      body: {
        name: "  maria   ferreira  souza ",
        email: "MARIA.FERREIRA@ALUNO.EDU.BR",
      },
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: student.id,
      name: "Maria Ferreira Souza",
      email: "maria.ferreira@aluno.edu.br",
      updated_by: user.id,
    });
  });

  it("should reject update when the new email belongs to another student", async () => {
    const { user, plainPassword } = await context.seedUser({
      email: "admin@school.test",
    });
    const token = await context.login({
      email: user.email,
      password: plainPassword,
    });
    const firstStudent = await context.seedStudent({
      ra: "20240001",
      email: "first@aluno.edu.br",
      cpf: "41641720026",
    });
    await context.seedStudent({
      ra: "20240002",
      email: "second@aluno.edu.br",
      cpf: "30830727086",
    });

    const response = await context.request<{ message: string }>(
      `/students/${firstStudent.id}`,
      {
        method: "PUT",
        token,
        body: {
          name: "First Student Updated",
          email: "SECOND@ALUNO.EDU.BR",
        },
      },
    );

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      message: "A student with this email already exists",
    });
  });
});
