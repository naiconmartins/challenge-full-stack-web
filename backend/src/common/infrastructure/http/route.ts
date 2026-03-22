import { studentsRouter } from "@/modules/students/infrastructure/http/routes/students.route";
import { authRouter } from "@/modules/users/infrastructure/http/routes/auth.route";
import { IRouter, Router } from "express";

const routes: IRouter = Router();

routes.use("/students", studentsRouter);
routes.use("/auth", authRouter);

export { routes };
