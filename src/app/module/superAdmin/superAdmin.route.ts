import { Router } from "express";
import checkAuth from "../../middleware/checkAuth";
import validateRequest from "../../middleware/validateRequest";
import { Role } from "../../../generated/prisma/enums";
import { SuperAdminController } from "./superAdmin.controller";
import { SuperAdminValidation } from "./superAdmin.validation";

const router = Router();

// Get all Super Admins
router.get(
  "/",
  checkAuth(Role.SUPER_ADMIN),
  SuperAdminController.getAllSuperAdmins,
);

// Get Super Admin by ID
router.get(
  "/:id",
  checkAuth(Role.SUPER_ADMIN),
  SuperAdminController.getSuperAdminById,
);

// Update Super Admin by ID
router.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN),
  validateRequest(SuperAdminValidation.updateSuperAdminZodSchema),
  SuperAdminController.updateSuperAdmin,
);

// Soft delete Super Admin by ID
router.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN),
  SuperAdminController.softDeleteSuperAdmin,
);

export const SuperAdminRoutes = router;
