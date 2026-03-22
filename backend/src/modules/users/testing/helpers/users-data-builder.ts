import { UserModel } from "@/modules/users/domain/models/users.model";
import { randomUUID } from "node:crypto";

type Props = Partial<UserModel>;

export function UsersDataBuilder(props: Props): UserModel {
  return {
    id: props.id ?? randomUUID(),
    name: props.name ?? "Test User",
    email: props.email ?? `test-${randomUUID()}@test.com`,
    password: props.password ?? "hashed_password",
    created_at: props.created_at ?? new Date(),
    updated_at: props.updated_at ?? new Date(),
  };
}
