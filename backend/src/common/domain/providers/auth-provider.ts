import { UserRole } from "@/modules/users/domain/models/user-role";

export type GenerateAuthKeyProps = {
  access_token: string;
};

export type VerifyAuthKeyProps = {
  user_id: string;
  role: UserRole;
};

export type GenerateAuthKeyInput = {
  user_id: string;
  role: UserRole;
};

export interface AuthProvider {
  generateAuthKey(input: GenerateAuthKeyInput): GenerateAuthKeyProps;
  verifiyAuthKey(token: string): VerifyAuthKeyProps;
}
