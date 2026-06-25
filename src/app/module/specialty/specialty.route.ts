import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import checkAuth from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router: Router = Router();

router.post(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  SpecialtyController.createSpecialty,
);
router.get("/", SpecialtyController.getAllSpecialties);

router.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  SpecialtyController.updateSpecialty,
);
router.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  SpecialtyController.deleteSpecialty,
);

export const SpecialtyRoutes = router;
