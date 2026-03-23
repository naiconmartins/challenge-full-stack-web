import { RepositoryInterface } from "@/common/domain/repositories/repository.interface";
import { UserRole } from "../models/user-role";
import { UserModel } from "../models/users.model";

export type CreateUserProps = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export interface UsersRepository extends RepositoryInterface<
  UserModel,
  CreateUserProps
> {
  findByEmail(email: string): Promise<UserModel>;
  conflictingEmail(email: string): Promise<void>;
}
