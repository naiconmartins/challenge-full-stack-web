import { ForbiddenError } from "@/common/domain/errors/forbidden-error";
import { UserRole } from "@/modules/users/domain/models/user-role";
import { NextFunction, Request, Response } from "express";

export function authorizeRoles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError("User does not have permission");
    }

    next();
  };
}
