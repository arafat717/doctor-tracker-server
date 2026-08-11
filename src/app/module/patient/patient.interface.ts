import type { Gender } from "../../../generated/prisma";

export interface ICreatePatient {
  name: string;
  age?: number;
  gender?: Gender;
  condition?: string;
  phone?: string;
  address?: string;
  doctorId: string;
}

export type IUpdatePatient = Partial<ICreatePatient>;

export interface IPatientFilters {
  search?: string;
  condition?: string;
  doctorId?: string;
  gender?: Gender;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
