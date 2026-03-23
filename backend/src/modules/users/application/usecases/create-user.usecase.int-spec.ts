import { ConflictError } from "@/common/domain/errors/conflict-error";
import { HashProvider } from "@/common/domain/providers/hash-provider";
import { BcryptjsHashProvider } from "@/common/infrastructure/providers/hash-provider/bcryptjs-hash.provider";
import "reflect-metadata";
import { UsersInMemoryRepository } from "../../infrastructure/in-memory/repositories/users-in-memory.repository";
import { UsersDataBuilder } from "../../testing/helpers/users-data-builder";
import { CreateUserUseCase } from "./create-user.usecase";

describe("CreateUserUseCase Integration Tests", () => {
  let sut: CreateUserUseCase.UseCase;
  let repository: UsersInMemoryRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    repository = new UsersInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new CreateUserUseCase.UseCase(repository, hashProvider);
  });

  it("should create a user and return output without password", async () => {
    const spyInsert = jest.spyOn(repository, "insert");
    const spyConflictingEmail = jest.spyOn(repository, "conflictingEmail");
    const userData = UsersDataBuilder({ password: "123456" });

    const result = await sut.execute({
      name: userData.name,
      email: userData.email,
      password: "123456",
      role: "ATTENDANT",
    });

    expect(result).toHaveProperty("id");
    expect(result.name).toBe(userData.name);
    expect(result.email).toBe(userData.email);
    expect(result.role).toBe("ATTENDANT");
    expect(result).not.toHaveProperty("password");
    expect(result).toHaveProperty("created_at");
    expect(result).toHaveProperty("updated_at");
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(spyConflictingEmail).toHaveBeenCalledTimes(1);
  });

  it("should hash the password before saving", async () => {
    const userData = UsersDataBuilder({ password: "123456" });

    const result = await sut.execute({
      name: userData.name,
      email: userData.email,
      password: "123456",
      role: "ATTENDANT",
    });

    const storedUser = await repository.findByEmail(userData.email);
    expect(storedUser.password).not.toBe("123456");

    const isValid = await hashProvider.compareHash(
      "123456",
      storedUser.password,
    );
    expect(isValid).toBe(true);

    expect(result).not.toHaveProperty("password");
  });

  it("should throw ConflictError when email is already in use", async () => {
    const userData = UsersDataBuilder({});
    await repository.insert(userData);

    await expect(() =>
      sut.execute({
        name: userData.name,
        email: userData.email,
        password: "123456",
        role: "ATTENDANT",
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
