import { InvalidCredentialsError } from "@/common/domain/errors/invalid-credentials-error";
import { HashProvider } from "@/common/domain/providers/hash-provider";
import { BcryptjsHashProvider } from "@/common/infrastructure/providers/hash-provider/bcryptjs-hash.provider";
import "reflect-metadata";
import { UsersInMemoryRepository } from "../../infrastructure/in-memory/repositories/users-in-memory.repository";
import { UsersDataBuilder } from "../../testing/helpers/users-data-builder";
import { AuthenticateUserUseCase } from "./authenticate-user.usecase";

describe("AuthenticateUserUseCase Integration Tests", () => {
  let sut: AuthenticateUserUseCase.UseCase;
  let repository: UsersInMemoryRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    repository = new UsersInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new AuthenticateUserUseCase.UseCase(repository, hashProvider);
  });

  it("should authenticate a user and return output without password", async () => {
    const spyFindByEmail = jest.spyOn(repository, "findByEmail");
    const user = UsersDataBuilder({
      email: "a@a.com",
      password: await hashProvider.generateHash("123456"),
    });
    await repository.insert(user);

    const result = await sut.execute({ email: "a@a.com", password: "123456" });

    expect(result).toStrictEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
    expect(result).not.toHaveProperty("password");
    expect(spyFindByEmail).toHaveBeenCalledTimes(1);
  });

  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "a@a.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await repository.insert(
      UsersDataBuilder({
        email: "a@a.com",
        password: await hashProvider.generateHash("123456"),
      }),
    );

    await expect(() =>
      sut.execute({
        email: "a@a.com",
        password: "fake",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should throw InvalidCredentialsError when email is empty", async () => {
    await expect(() =>
      sut.execute({ email: "", password: "123456" }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should throw InvalidCredentialsError when password is empty", async () => {
    await expect(() =>
      sut.execute({ email: "a@a.com", password: "" }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
