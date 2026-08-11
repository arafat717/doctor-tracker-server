import z from "zod";

const CreateDoctorZodSchema = z.object({
  name: z.string().trim().min(2, "Doctor name is required").max(100),
  specialization: z
    .string()
    .trim()
    .min(2, "Specialization is required")
    .max(100),
  hospital: z.string().trim().min(2, "Hospital is required").max(150),
  phone: z.string().trim().min(8, "Phone number is required").max(25),
  email: z.string().trim().email("Please enter a valid email address"),
});

const UpdateDoctorZodSchema = CreateDoctorZodSchema.partial();

const CreateDoctorPatientZodSchema = z.object({
  name: z.string().trim().min(2, "Patient name is required").max(100),
  age: z.coerce.number().int().min(0).max(150).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  condition: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(25).optional(),
  address: z.string().trim().max(255).optional(),
});

const DoctorFiltersZodSchema = z.object({
  search: z.string().trim().optional(),
  specialization: z.string().trim().optional(),
  hospital: z.string().trim().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
});

export const DoctorValidation = {
  CreateDoctorZodSchema,
  UpdateDoctorZodSchema,
  CreateDoctorPatientZodSchema,
  DoctorFiltersZodSchema,
};
