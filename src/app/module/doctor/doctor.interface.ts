import type { Gender } from "../../../generated/prisma";

export interface ICreateDoctor {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

export type IUpdateDoctor = Partial<ICreateDoctor>;

export interface IDoctorFilters {
  search?: string;
  specialization?: string;
  hospital?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ICreateDoctorPatient {
  name: string;
  age?: number;
  gender?: Gender;
  condition?: string;
  phone?: string;
  address?: string;
}
