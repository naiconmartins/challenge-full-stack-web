import { studentsRouter } from "@/modules/students/infraestructure/http/routes/students.route";
import { IRouter, Router } from "express";

const router: IRouter = Router();

router.use("/students", studentsRouter);

export { router };
