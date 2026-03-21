import { Router } from "express";
import { createStudentController } from "../controllers/create-student.controller";

const studentsRouter: Router = Router();

studentsRouter.post("/", createStudentController);

export { studentsRouter };
