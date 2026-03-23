import { isAuthenticated } from "@/common/infrastructure/http/middleware/isAuthenticated";
import { Router } from "express";
import { authenticateUserController } from "../controllers/authenticate-user.controller";
import { getMeController } from "../controllers/get-me.controller";
import { logoutUserController } from "../controllers/logout-user.controller";

const authRouter: Router = Router();

authRouter.post("/login", authenticateUserController);
authRouter.get("/me", isAuthenticated, getMeController);
authRouter.post("/logout", isAuthenticated, logoutUserController);

export { authRouter };
