import { ValidationError } from "@/common/domain/errors/validation-error";
import { dataValidation } from "@/common/infrastructure/validation/zod";
import { querySchema } from "./query.schema";

describe("querySchema", () => {
  it("should accept valid query params", () => {
    const result = dataValidation(querySchema, {
      page: "2",
      per_page: "10",
      sort: "name",
      sort_dir: "asc",
      filter: "maria",
    });

    expect(result).toStrictEqual({
      page: 2,
      per_page: 10,
      sort: "name",
      sort_dir: "asc",
      filter: "maria",
    });
  });

  it("should reject invalid sort values", () => {
    expect(() =>
      dataValidation(querySchema, {
        sort: "email",
      }),
    ).toThrow(ValidationError);
  });

  it("should reject invalid sort_dir values", () => {
    expect(() =>
      dataValidation(querySchema, {
        sort_dir: "ascending",
      }),
    ).toThrow(ValidationError);
  });
});
