import z from "zod";

export const authenticateUserSchema = z.object({
  email: z
    .email({ error: "Invalid email" })
    .trim()
    .transform(value => value.toLowerCase()),
  password: z
    .string({ error: "Password is required" })
    .trim()
    .min(1, "Password is required"),
});
