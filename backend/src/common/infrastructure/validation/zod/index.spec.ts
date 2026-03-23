import { ValidationError } from "@/common/domain/errors/validation-error";
import z from "zod";
import { dataValidation } from "./index";

describe("dataValidation", () => {
  it("should return parsed data when schema is valid", () => {
    const schema = z.object({
      name: z.string().trim(),
    });

    const result = dataValidation(schema, { name: "  Maria  " });

    expect(result).toStrictEqual({ name: "Maria" });
  });

  it("should throw ValidationError with formatted issues when schema is invalid", () => {
    const schema = z.object({
      user: z.object({
        email: z.email(),
      }),
    });

    expect(() =>
      dataValidation(schema, { user: { email: "invalid-email" } }),
    ).toThrow(ValidationError);

    try {
      dataValidation(schema, { user: { email: "invalid-email" } });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).errors).toStrictEqual([
        {
          field: "user.email",
          message: "Invalid email address",
        },
      ]);
    }
  });
});
