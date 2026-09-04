import { Router } from "express";
import checkAuth from "../../middleware/checkAuth";
import validateRequest from "../../middleware/validateRequest";
import { Role } from "../../../generated/prisma/enums";
import { AdminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";

const router = Router();

// Get all admins
router.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  AdminController.getAllAdmins,
);

// Get admin by ID
router.get(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  AdminController.getAdminById,
);

// Update admin by ID
router.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN),
  validateRequest(AdminValidation.updateAdminZodSchema),
  AdminController.updateAdmin,
);

// Soft delete admin by ID
router.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN),
  AdminController.softDeleteAdmin,
);

export const AdminRoutes = router;
