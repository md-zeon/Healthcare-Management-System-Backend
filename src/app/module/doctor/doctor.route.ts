import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import checkAuth from "../../middleware/checkAuth";
import validateRequest from "../../middleware/validateRequest";
import { DoctorValidation } from "./doctor.validation";
import { Role } from "../../../generated/prisma/enums";

const router: Router = Router();

// Get all doctors - accessible by Admin, Super Admin, and Doctor
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR),
  DoctorController.getAllDoctors,
);

// Get doctor by ID
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR),
  DoctorController.getDoctorById,
);

// Update doctor by ID
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR),
  validateRequest(DoctorValidation.updateDoctorValidationSchema),
  DoctorController.updateDoctor,
);
// 💡 Note: DOCTOR can update their own profile
// In production, you should add logic to ensure doctors can only update their own profile

// Delete doctor by ID
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DoctorController.softDeleteDoctor,
);

export const DoctorRoutes = router;
