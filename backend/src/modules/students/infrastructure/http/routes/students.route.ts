import { Router } from "express";
import { createStudentController } from "../controllers/create-student.controller";
import { deleteStudentController } from "../controllers/delete-student.controller";
import { getStudentController } from "../controllers/get-student.controller";
import { searchStudentController } from "../controllers/search-student.controller";
import { updateStudentController } from "../controllers/update-student.controller";

const studentsRouter: Router = Router();

studentsRouter.post("/", createStudentController);
studentsRouter.put("/:id", updateStudentController);
studentsRouter.get("/", searchStudentController);
studentsRouter.get("/:id", getStudentController);
studentsRouter.delete("/:id", deleteStudentController);

export { studentsRouter };
