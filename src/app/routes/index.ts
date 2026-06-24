import { Router } from "express";
import { AuthRoute } from "../module/auth/auth.route";
import { SpecialtyRoutes } from "../module/specialty/specialty.route";
import { UserRoutes } from "../module/user/user.route";
import { DoctorRoutes } from "../module/doctor/doctor.route";

const router: Router = Router();

router.use("/auth", AuthRoute);
router.use("/specialties", SpecialtyRoutes);
router.use("/users", UserRoutes);
router.use("/doctors", DoctorRoutes);

const IndexRoutes = router;
export default IndexRoutes;
