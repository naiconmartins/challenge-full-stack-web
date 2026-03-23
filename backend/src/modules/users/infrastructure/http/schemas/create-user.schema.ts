import { USER_ROLES } from "@/modules/users/domain/models/user-role";
import z from "zod";

export const createUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  role: z.enum(USER_ROLES),
});
