import { UnauthorizedError } from "@/common/domain/errors/unauthorized-error";
import "reflect-metadata";
import { UsersInMemoryRepository } from "../../infrastructure/in-memory/repositories/users-in-memory.repository";
import { UsersDataBuilder } from "../../testing/helpers/users-data-builder";
import { GetMeUseCase } from "./get-me.usecase";

describe("GetMeUseCase", () => {
  let sut: GetMeUseCase.UseCase;
  let repository: UsersInMemoryRepository;

  beforeEach(() => {
    repository = new UsersInMemoryRepository();
    sut = new GetMeUseCase.UseCase(repository);
  });

  it("should return authenticated user data with role", async () => {
    const user = UsersDataBuilder({ role: "ADMINISTRATIVE" });
    await repository.insert(user);

    const result = await sut.execute({ user_id: user.id });

    expect(result).toStrictEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  });

  it("should throw UnauthorizedError when authenticated user no longer exists", async () => {
    await expect(
      sut.execute({ user_id: "missing-user-id" }),
    ).rejects.toStrictEqual(new UnauthorizedError("Invalid token"));
  });
});
