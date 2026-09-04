import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import checkAuth from "../../middleware/checkAuth";
import validateRequest from "../../middleware/validateRequest";
import { DoctorValidation } from "./doctor.validation";

const router: Router = Router();

// Get all doctors - accessible by Admin, Super Admin, and Doctor
router.get(
  "/",
  checkAuth("ADMIN", "SUPER_ADMIN", "DOCTOR"),
  DoctorController.getAllDoctors,
);

// Get doctor by ID
router.get(
  "/:id",
  checkAuth("ADMIN", "SUPER_ADMIN", "DOCTOR"),
  DoctorController.getDoctorById,
);

// Update doctor by ID
router.patch(
  "/:id",
  checkAuth("ADMIN", "SUPER_ADMIN", "DOCTOR"),
  validateRequest(DoctorValidation.updateDoctorValidationSchema),
  DoctorController.updateDoctor,
);
// 💡 Note: DOCTOR can update their own profile
// In production, you should add logic to ensure doctors can only update their own profile

// Delete doctor by ID
router.delete(
  "/:id",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  DoctorController.softDeleteDoctor,
);

export const DoctorRoutes = router;
