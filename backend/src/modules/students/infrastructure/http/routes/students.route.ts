import { isAuthenticated } from "@/common/infrastructure/http/middleware/isAuthenticated";
import { Router } from "express";
import { createStudentController } from "../controllers/create-student.controller";
import { deleteStudentController } from "../controllers/delete-student.controller";
import { getStudentController } from "../controllers/get-student.controller";
import { searchStudentController } from "../controllers/search-student.controller";
import { updateStudentController } from "../controllers/update-student.controller";

const studentsRouter: Router = Router();

studentsRouter.post("/", isAuthenticated, createStudentController);
studentsRouter.put("/:id", isAuthenticated, updateStudentController);
studentsRouter.get("/", isAuthenticated, searchStudentController);
studentsRouter.get("/:id", isAuthenticated, getStudentController);
studentsRouter.delete("/:id", isAuthenticated, deleteStudentController);

export { studentsRouter };
