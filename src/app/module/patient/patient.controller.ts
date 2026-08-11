import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PatientService } from "./patient.service";

const getPatients = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientService.getPatients({
    ...req.query,
    page: Number(req.query.page ?? 1),
    limit: Number(req.query.limit ?? 10),
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patients fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getPatientById = catchAsync(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await PatientService.getPatientById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient details fetched successfully",
    data: result,
  });
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientService.createPatient(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await PatientService.updatePatient(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient updated successfully",
    data: result,
  });
});

const deletePatient = catchAsync(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await PatientService.deletePatient(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient deleted successfully",
    data: result,
  });
});

export const PatientController = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
