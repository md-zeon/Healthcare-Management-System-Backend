import { Router } from "express";
import SpecialtyRoutes from "../module/specialty/specialty.route";
import AuthRoute from "../module/auth/auth.route";

const router: Router = Router();

router.use("/auth", AuthRoute);
router.use("/specialties", SpecialtyRoutes);

const IndexRoutes = router;
export default IndexRoutes;
