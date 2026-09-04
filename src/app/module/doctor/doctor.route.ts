import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import checkAuth from "../../middleware/checkAuth";

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

// TODO: Implement the following routes
// router.patch("/:id", DoctorController.updateDoctor);
// router.delete("/:id", DoctorController.deleteDoctor);

export const DoctorRoutes = router;
