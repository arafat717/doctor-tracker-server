import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DoctorService } from "./doctor.service";

const getDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.getDoctors({
    ...req.query,
    page: Number(req.query.page ?? 1),
    limit: Number(req.query.limit ?? 10),
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctors retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await DoctorService.getDoctorById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor details fetched successfully",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.createDoctor(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await DoctorService.updateDoctor(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor updated successfully",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await DoctorService.deleteDoctor(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});

const getDoctorPatients = catchAsync(async (req: Request, res: Response) => {
  const doctorId = String(req.params.doctorId);
  const result = await DoctorService.getDoctorPatients(doctorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor patients fetched successfully",
    data: result,
  });
});

const addPatientToDoctor = catchAsync(async (req: Request, res: Response) => {
  const doctorId = String(req.params.doctorId);
  const result = await DoctorService.addPatientToDoctor(doctorId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Patient added under doctor successfully",
    data: result,
  });
});

export const DoctorController = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorPatients,
  addPatientToDoctor,
};
