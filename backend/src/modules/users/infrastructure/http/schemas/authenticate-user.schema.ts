import z from "zod";

export const authenticateUserSchema = z.object({
  email: z.email(),
  password: z.string(),
});
