import { UserRole } from "./user-role";

export interface UserModel {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}
