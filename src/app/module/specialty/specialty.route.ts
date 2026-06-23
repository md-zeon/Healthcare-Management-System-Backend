import { Router } from "express";
import SpecialtyController from "./specialty.controller";

const router: Router = Router();

router.post("/", SpecialtyController.createSpecialty);
router.get("/", SpecialtyController.getAllSpecialties);
router.patch("/:id", SpecialtyController.updateSpecialty);
router.delete("/:id", SpecialtyController.deleteSpecialty);

const SpecialtyRoutes = router;
export default SpecialtyRoutes;
