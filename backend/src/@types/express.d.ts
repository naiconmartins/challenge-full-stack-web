import { UserRole } from "@/modules/users/domain/models/user-role";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export {};
