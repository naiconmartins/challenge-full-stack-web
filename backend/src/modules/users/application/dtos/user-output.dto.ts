import { UserRole } from "../../domain/models/user-role";
import { UserModel } from "../../domain/models/users.model";

export type UserOutput = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
};

export function toUserOutput(user: UserModel): UserOutput {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}
