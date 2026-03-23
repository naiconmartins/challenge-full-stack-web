import { ValidationError } from "@/common/domain/errors/validation-error";
import { dataValidation } from "@/common/infrastructure/validation/zod";
import { authenticateUserSchema } from "./authenticate-user.schema";
import { createUserSchema } from "./create-user.schema";

describe("user auth schemas", () => {
  it("should normalize create-user email and reject blank credentials", () => {
    expect(() =>
      dataValidation(createUserSchema, {
        name: "   ",
        email: "ADMIN@ESCOLA.COM",
        password: "      ",
        role: "ADMINISTRATIVE",
      }),
    ).toThrow(ValidationError);

    const result = dataValidation(createUserSchema, {
      name: " Admin User ",
      email: "ADMIN@ESCOLA.COM",
      password: "123456",
      role: "ADMINISTRATIVE",
    });

    expect(result).toStrictEqual({
      name: "Admin User",
      email: "admin@escola.com",
      password: "123456",
      role: "ADMINISTRATIVE",
    });
  });

  it("should normalize login email and reject empty password", () => {
    expect(() =>
      dataValidation(authenticateUserSchema, {
        email: "ADMIN@ESCOLA.COM",
        password: "   ",
      }),
    ).toThrow(ValidationError);

    const result = dataValidation(authenticateUserSchema, {
      email: "ADMIN@ESCOLA.COM",
      password: "123456",
    });

    expect(result).toStrictEqual({
      email: "admin@escola.com",
      password: "123456",
    });
  });
});
