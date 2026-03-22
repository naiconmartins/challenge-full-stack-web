import { UnauthorizedError } from "@/common/domain/errors/unauthorized-error";
import {
  AuthProvider,
  GenerateAuthKeyProps,
  VerifyAuthKeyProps,
} from "@/common/domain/providers/auth-provider";
import { env } from "@/common/infrastructure/env";
import jwt from "jsonwebtoken";

type DecodedTokenProps = {
  sub: string;
};

export class JwtAuthProvider implements AuthProvider {
  generateAuthKey(user_id: string): GenerateAuthKeyProps {
    const access_token = jwt.sign({}, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
      subject: user_id,
    });
    return { access_token };
  }

  verifiyAuthKey(token: string): VerifyAuthKeyProps {
    try {
      const decodedToken = jwt.verify(token, env.JWT_SECRET);
      const { sub } = decodedToken as DecodedTokenProps;
      return { user_id: sub };
    } catch {
      throw new UnauthorizedError("Invalid credentials");
    }
  }
}
