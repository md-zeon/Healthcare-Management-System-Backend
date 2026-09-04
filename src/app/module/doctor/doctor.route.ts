import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import checkAuth from "../../middleware/checkAuth";

const router: Router = Router();

// Get all doctors - accessible by Admin, Super Admin, and Doctor
router.get(
  "/",
  //   checkAuth("ADMIN", "SUPER_ADMIN", "DOCTOR"),
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
  DoctorController.updateDoctor,
);
// 💡 Note: DOCTOR can update their own profile
// In production, you should add logic to ensure doctors can only update their own profile

// TODO: Implement the following routes
// router.delete("/:id", DoctorController.deleteDoctor);

export const DoctorRoutes = router;
