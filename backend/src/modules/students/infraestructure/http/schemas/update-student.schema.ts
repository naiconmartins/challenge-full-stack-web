import z from "zod";

export const updateStudentBodySchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .max(100, "Name must be at most 100 characters")
    .refine(value => value.split(/\s+/).length >= 2, {
      message: "Full name is required",
    })
    .transform(value =>
      value
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" "),
    ),
  email: z.email({ error: "Invalid email" }).trim(),
});

export const updateStudentParamSchema = z.object({
  id: z.string({ error: "Id is required" }),
});
