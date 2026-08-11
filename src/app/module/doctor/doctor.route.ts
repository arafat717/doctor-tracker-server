import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "../../../generated/prisma";
import { DoctorController } from "./doctor.controller";
import { DoctorValidation } from "./doctor.validation";

const router = Router();

router.get("/", auth(Role.ADMIN), DoctorController.getDoctors);
router.get("/:id", auth(Role.ADMIN), DoctorController.getDoctorById);
router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(DoctorValidation.CreateDoctorZodSchema),
  DoctorController.createDoctor,
);
router.patch(
  "/:id",
  auth(Role.ADMIN),
  validateRequest(DoctorValidation.UpdateDoctorZodSchema),
  DoctorController.updateDoctor,
);
router.delete("/:id", auth(Role.ADMIN), DoctorController.deleteDoctor);

router.get(
  "/:doctorId/patients",
  auth(Role.ADMIN),
  DoctorController.getDoctorPatients,
);

router.post(
  "/:doctorId/patients",
  auth(Role.ADMIN),
  validateRequest(DoctorValidation.CreateDoctorPatientZodSchema),
  DoctorController.addPatientToDoctor,
);

export const DoctorRoutes = router;
