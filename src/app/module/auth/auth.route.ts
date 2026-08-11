import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthController } from "./auth.controller";
import { UserValidation } from "./auth.validation";
import { Role } from "../../../generated/prisma";

const router = Router();


router.post("/login",
	validateRequest(UserValidation.LoginZodSchema),
	 AuthController.loginUser);
router.get(
	"/me",
	auth(Role.ADMIN),
	AuthController.getMe,
);
router.post("/refresh-token", AuthController.refreshToken);
export const AuthRoutes = router;
