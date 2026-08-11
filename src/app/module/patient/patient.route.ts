import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "../../../generated/prisma";
import { PatientController } from "./patient.controller";
import { PatientValidation } from "./patient.validation";

const router = Router();

router.get("/", auth(Role.ADMIN), PatientController.getPatients);
router.get("/:id", auth(Role.ADMIN), PatientController.getPatientById);
router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(PatientValidation.CreatePatientZodSchema),
  PatientController.createPatient,
);

router.patch(
  "/:id",
  auth(Role.ADMIN),
  validateRequest(PatientValidation.UpdatePatientZodSchema),
  PatientController.updatePatient,
);

router.delete("/:id", auth(Role.ADMIN), PatientController.deletePatient);

export const PatientRoutes = router;
