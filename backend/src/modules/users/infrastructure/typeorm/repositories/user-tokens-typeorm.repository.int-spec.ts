import { NotFoundError } from "@/common/domain/errors/not-found-error";
import { UserModel } from "@/modules/users/domain/models/users.model";
import { UserTokensRepository } from "@/modules/users/domain/repositories/user-tokens.repository";
import { UsersRepository } from "@/modules/users/domain/repositories/users.repository";
import { randomUUID } from "crypto";
import { DataSource } from "typeorm";
import { UserToken } from "../entities/user-tokens.entity";
import { User } from "../entities/users.entity";
import { UserTokensTypeormRepository } from "./user-tokens-typeorm.repository";
import { UsersTypeormRepository } from "./users-typeorm.repository";

declare const testDataSource: DataSource;
declare function UsersDataBuilder(props: Partial<UserModel>): UserModel;

describe("UserTokensTypeormRepository Integration Tests", () => {
  let userTokensRepository: UserTokensRepository;
  let usersRepository: UsersRepository;
  let typeormEntityManager: any;

  beforeAll(async () => {
    await testDataSource.initialize();
    typeormEntityManager = testDataSource.createEntityManager();
  });

  afterAll(async () => {
    await testDataSource.manager.query("DELETE FROM user_tokens");
    await testDataSource.manager.query("DELETE FROM users");
    await testDataSource.destroy();
  });

  beforeEach(async () => {
    await testDataSource.manager.query("DELETE FROM user_tokens");
    await testDataSource.manager.query("DELETE FROM users");
    usersRepository = new UsersTypeormRepository(
      typeormEntityManager.getRepository(User),
    );
    userTokensRepository = new UserTokensTypeormRepository(
      typeormEntityManager.getRepository(UserToken),
      usersRepository,
    );
  });

  it("should throw error on generate UserToken when a user not found", async () => {
    const data = { user_id: randomUUID() };
    await expect(() =>
      userTokensRepository.generate(data),
    ).rejects.toBeInstanceOf(NotFoundError);
    await expect(userTokensRepository.generate(data)).rejects.toThrow(
      new NotFoundError(`User not found using ID ${data.user_id}`),
    );
  });

  it("should generate a new UserToken", async () => {
    const userData = UsersDataBuilder({ name: "John Doe", email: "a@a.com" });
    const user = await usersRepository.insert(userData);

    const data = {
      user_id: user.id,
    };
    const result = await userTokensRepository.generate(data);

    expect(result.id).toBeDefined();
    expect(result.token).toBeDefined();
    expect(result.user_id).toEqual(data.user_id);
  });

  it("should throw error when token not found", async () => {
    const token = randomUUID();
    await expect(() =>
      userTokensRepository.findByToken(token),
    ).rejects.toBeInstanceOf(NotFoundError);
    await expect(userTokensRepository.findByToken(token)).rejects.toThrow(
      new NotFoundError(`User token not found`),
    );
  });

  it("should finds a UserToken by token", async () => {
    const userData = UsersDataBuilder({ name: "John Doe", email: "a@a.com" });
    const user = await usersRepository.insert(userData);

    const data = {
      user_id: user.id,
    };
    const userToken = await userTokensRepository.generate(data);

    const result = await userTokensRepository.findByToken(userToken.token);
    expect(result).toMatchObject(userToken);
  });
});
