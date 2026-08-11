import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
  NextFunction,
  type Request,
  type Response,
} from "express";
import httpStatus from "http-status";
import z from "zod";
import config from "./app/config";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { AuthRoutes } from "./app/module/auth/auth.route";
import { DashboardRoutes } from "./app/module/dashboard/dashboard.route";
import { DoctorRoutes } from "./app/module/doctor/doctor.route";
import { PatientRoutes } from "./app/module/patient/patient.route";

const app: Application = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://doctor-tracker-gamma.vercel.app",
    ],
    credentials: true,
  }),
);

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRoutes);
app.use("/api/doctors", DoctorRoutes);
app.use("/api/patients", PatientRoutes);
app.use("/api/dashboard", DashboardRoutes);

// Basic route
app.get("/", async (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to Doctor tracker System Backend",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
