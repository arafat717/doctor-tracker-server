import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma";
import { DashboardController } from "./dashboard.controller";

const router = Router();

router.get(
  "/summary",
  auth(Role.ADMIN),
  DashboardController.getDashboardSummary,
);

export const DashboardRoutes = router;
