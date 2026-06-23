import { Router } from "express";
import SpecialtyRoutes from "../module/specialty/specialty.route";

const router: Router = Router();

router.use("/specialties", SpecialtyRoutes);

const IndexRoutes = router;
export default IndexRoutes;
