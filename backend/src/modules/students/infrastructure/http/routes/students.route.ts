import { authorizeRoles } from "@/common/infrastructure/http/middleware/authorizeRoles";
import { isAuthenticated } from "@/common/infrastructure/http/middleware/isAuthenticated";
import { Router } from "express";
import { createStudentController } from "../controllers/create-student.controller";
import { deleteStudentController } from "../controllers/delete-student.controller";
import { getStudentController } from "../controllers/get-student.controller";
import { searchStudentController } from "../controllers/search-student.controller";
import { updateStudentController } from "../controllers/update-student.controller";

const studentsRouter: Router = Router();

studentsRouter.post(
  "/",
  isAuthenticated,
  authorizeRoles("ADMIN", "ATTENDANT"),
  createStudentController,
);
studentsRouter.put(
  "/:id",
  isAuthenticated,
  authorizeRoles("ADMIN", "ATTENDANT"),
  updateStudentController,
);
studentsRouter.get(
  "/",
  isAuthenticated,
  authorizeRoles("ADMIN", "ATTENDANT"),
  searchStudentController,
);
studentsRouter.get(
  "/:id",
  isAuthenticated,
  authorizeRoles("ADMIN", "ATTENDANT"),
  getStudentController,
);
studentsRouter.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("ADMIN"),
  deleteStudentController,
);

export { studentsRouter };
