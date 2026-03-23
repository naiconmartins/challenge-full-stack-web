import "reflect-metadata";

import { RevokedTokensRepository } from "@/modules/users/domain/repositories/revoked-tokens.repository";
import { RevokedTokensInMemoryRepository } from "@/modules/users/infrastructure/in-memory/repositories/revoked-tokens-in-memory.repository";
import { LogoutUserUseCase } from "./logout-user.usecase";

describe("LogoutUserUseCase Unit Tests", () => {
  let sut: LogoutUserUseCase.UseCase;
  let repository: RevokedTokensRepository;

  beforeEach(() => {
    repository = new RevokedTokensInMemoryRepository();
    sut = new LogoutUserUseCase.UseCase(repository);
  });

  it("should revoke the provided token", async () => {
    const spyRevokeToken = jest.spyOn(repository, "revokeToken");
    const access_token = "valid.jwt.token";

    await sut.execute({ access_token });

    expect(spyRevokeToken).toHaveBeenCalledTimes(1);
    expect(spyRevokeToken).toHaveBeenCalledWith(access_token);
  });

  it("should persist the token in the revoked list", async () => {
    const access_token = "valid.jwt.token";

    await sut.execute({ access_token });

    const isRevoked = await repository.isRevoked(access_token);
    expect(isRevoked).toBe(true);
  });

  it("should not affect other tokens when revoking one", async () => {
    const token_a = "token.a";
    const token_b = "token.b";

    await sut.execute({ access_token: token_a });

    expect(await repository.isRevoked(token_a)).toBe(true);
    expect(await repository.isRevoked(token_b)).toBe(false);
  });

  it("should allow revoking the same token more than once without error", async () => {
    const access_token = "valid.jwt.token";

    await sut.execute({ access_token });
    await expect(sut.execute({ access_token })).resolves.not.toThrow();

    expect(await repository.isRevoked(access_token)).toBe(true);
  });
});
