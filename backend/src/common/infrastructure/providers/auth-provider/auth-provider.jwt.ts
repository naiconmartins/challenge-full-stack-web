import { UnauthorizedError } from "@/common/domain/errors/unauthorized-error";
import {
  AuthProvider,
  GenerateAuthKeyInput,
  GenerateAuthKeyProps,
  VerifyAuthKeyProps,
} from "@/common/domain/providers/auth-provider";
import { env } from "@/common/infrastructure/env";
import { UserRole } from "@/modules/users/domain/models/user-role";
import jwt from "jsonwebtoken";

type DecodedTokenProps = {
  sub: string;
  role: UserRole;
};

export class JwtAuthProvider implements AuthProvider {
  generateAuthKey(input: GenerateAuthKeyInput): GenerateAuthKeyProps {
    const access_token = jwt.sign({ role: input.role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
      subject: input.user_id,
    });
    return { access_token };
  }

  verifiyAuthKey(token: string): VerifyAuthKeyProps {
    try {
      const decodedToken = jwt.verify(token, env.JWT_SECRET);
      const { sub, role } = decodedToken as DecodedTokenProps;
      return { user_id: sub, role };
    } catch {
      throw new UnauthorizedError("Invalid credentials");
    }
  }
}
