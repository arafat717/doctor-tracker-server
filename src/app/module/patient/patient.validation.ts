import z from "zod";

const CreatePatientZodSchema = z.object({
  name: z.string().trim().min(2, "Patient name is required").max(100),
  age: z.coerce.number().int().min(0).max(150).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  condition: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(25).optional(),
  address: z.string().trim().max(255).optional(),
  doctorId: z.string().trim().min(1, "Doctor ID is required"),
});

const UpdatePatientZodSchema = CreatePatientZodSchema.partial();

const PatientFiltersZodSchema = z.object({
  search: z.string().trim().optional(),
  condition: z.string().trim().optional(),
  doctorId: z.string().trim().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
});

export const PatientValidation = {
  CreatePatientZodSchema,
  UpdatePatientZodSchema,
  PatientFiltersZodSchema,
};
