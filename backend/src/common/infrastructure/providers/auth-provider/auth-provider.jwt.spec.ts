import { UnauthorizedError } from "@/common/domain/errors/unauthorized-error";
import { UsersDataBuilder } from "@/modules/users/testing/helpers/users-data-builder";
import "reflect-metadata";
import { JwtAuthProvider } from "./auth-provider.jwt";

describe("JwtAuthProvider", () => {
  let sut: JwtAuthProvider;

  beforeEach(() => {
    sut = new JwtAuthProvider();
  });

  it("should generate a token containing user id and role", () => {
    const user = UsersDataBuilder({ role: "ADMINISTRATIVE" });
    const { access_token } = sut.generateAuthKey({
      user_id: user.id,
      role: user.role,
    });

    const result = sut.verifiyAuthKey(access_token);

    expect(access_token).toBeDefined();
    expect(result).toStrictEqual({
      user_id: user.id,
      role: user.role,
    });
  });

  it("should throw UnauthorizedError when token is invalid", () => {
    expect(() => sut.verifiyAuthKey("invalid.token")).toThrow(
      UnauthorizedError,
    );
  });
});
