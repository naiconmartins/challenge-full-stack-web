import { authorizeRoles } from "@/common/infrastructure/http/middleware/authorizeRoles";
import { isAuthenticated } from "@/common/infrastructure/http/middleware/isAuthenticated";
import { Router } from "express";
import { createUserController } from "../controllers/create-user.controller";

const usersRouter: Router = Router();

usersRouter.post(
  "/",
  isAuthenticated,
  authorizeRoles("ADMINISTRATIVE"),
  createUserController,
);

export { usersRouter };
