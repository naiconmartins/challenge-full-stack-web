import { USER_ROLES } from "@/modules/users/domain/models/user-role";
import z from "zod";

export const createUserSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(1, "Name is required"),
  email: z
    .email({ error: "Invalid email" })
    .trim()
    .transform(value => value.toLowerCase()),
  password: z
    .string({ error: "Password is required" })
    .trim()
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(USER_ROLES),
});
