import { Router } from "express";
import { createStudentController } from "../controllers/create-student.controller";
import { updateStudentController } from "../controllers/update-student.controller";

const studentsRouter: Router = Router();

studentsRouter.post("/", createStudentController);
studentsRouter.put("/:id", updateStudentController);

export { studentsRouter };
