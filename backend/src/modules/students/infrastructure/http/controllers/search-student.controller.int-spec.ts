import { HttpIntegrationContext } from "@/common/testing/http-integration.helper";

describe("SearchStudentController HTTP integration tests", () => {
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

  it("should search students using pagination, sort and filter", async () => {
    const { user, plainPassword } = await context.seedUser({
      email: "admin@school.test",
    });
    const token = await context.login({
      email: user.email,
      password: plainPassword,
    });

    await context.seedStudent({
      ra: "20240001",
      name: "Carlos Alberto Lima",
      email: "carlos@aluno.edu.br",
      cpf: "41641720026",
    });
    await context.seedStudent({
      ra: "20240002",
      name: "Maria Clara Souza",
      email: "maria@aluno.edu.br",
      cpf: "30830727086",
    });
    await context.seedStudent({
      ra: "20240003",
      name: "Marina Alves Costa",
      email: "marina@aluno.edu.br",
      cpf: "27548493422",
    });

    const response = await context.request<{
      items: Array<{ name: string; ra: string }>;
      total: number;
      current_page: number;
      per_page: number;
      last_page: number;
    }>("/students?page=1&per_page=1&sort=name&sort_dir=asc&filter=mar", {
      token,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      total: 2,
      current_page: 1,
      per_page: 1,
      last_page: 2,
    });
    expect(response.body?.items).toHaveLength(1);
    expect(response.body?.items[0]).toMatchObject({
      name: "Maria Clara Souza",
      ra: "20240002",
    });
  });
});
