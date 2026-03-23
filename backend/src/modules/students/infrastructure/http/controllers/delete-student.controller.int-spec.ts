import { dataSource } from "@/common/infrastructure/typeorm";
import { HttpIntegrationContext } from "@/common/testing/http-integration.helper";
import { Student } from "../../typeorm/entities/student.entity";

describe("DeleteStudentController HTTP integration tests", () => {
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

  it("should delete the student", async () => {
    const { user, plainPassword } = await context.seedUser({
      email: "admin@school.test",
    });
    const token = await context.login({
      email: user.email,
      password: plainPassword,
    });
    const student = await context.seedStudent({
      ra: "20240001",
      email: "student@aluno.edu.br",
      cpf: "41641720026",
    });

    const deleteResponse = await context.request(`/students/${student.id}`, {
      method: "DELETE",
      token,
    });

    expect(deleteResponse.status).toBe(204);

    const persistedStudent = await dataSource.getRepository(Student).findOneBy({
      id: student.id,
    });

    expect(persistedStudent).toBeNull();
  });
});
