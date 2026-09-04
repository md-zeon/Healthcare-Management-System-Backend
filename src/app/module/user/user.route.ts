import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { createAdminZodSchema, createDoctorZodSchema, createSuperAdminZodSchema } from "./user.validation";
import checkAuth from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router: Router = Router();

router.post(
  "/create-doctor",
  validateRequest(createDoctorZodSchema),
  UserController.createDoctor,
);

router.post(
  "/create-admin",
  checkAuth(Role.SUPER_ADMIN),
  validateRequest(createAdminZodSchema),
  UserController.createAdmin,
);

router.post(
  "/create-super-admin",
  checkAuth(Role.SUPER_ADMIN),
  validateRequest(createSuperAdminZodSchema),
  UserController.createSuperAdmin,
);

export const UserRoutes = router;
