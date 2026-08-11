import { prisma } from "../../lib/prisma";
import type {
  ICreatePatient,
  IPatientFilters,
  IUpdatePatient,
} from "./patient.interface";

const normalizePage = (value?: number) => Number(value ?? 1);
const normalizeLimit = (value?: number) => Number(value ?? 10);

const buildPatientWhere = (filters: IPatientFilters) => {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { condition: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search, mode: "insensitive" } },
      { address: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.doctorId) {
    where.doctorId = filters.doctorId;
  }

  if (filters.condition) {
    where.condition = {
      contains: filters.condition,
      mode: "insensitive",
    };
  }

  if (filters.gender) {
    where.gender = filters.gender;
  }

  if (filters.startDate || filters.endDate) {
    const createdAtFilter: { gte?: Date; lte?: Date } = {};

    if (filters.startDate) {
      createdAtFilter.gte = new Date(filters.startDate);
    }

    if (filters.endDate) {
      createdAtFilter.lte = new Date(filters.endDate);
    }

    where.createdAt = createdAtFilter;
  }

  return where;
};

const getPatients = async (filters: IPatientFilters) => {
  const page = normalizePage(filters.page);
  const limit = normalizeLimit(filters.limit);
  const where = buildPatientWhere(filters);
  const skip = (page - 1) * limit;

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            hospital: true,
          },
        },
      },
    }),
    prisma.patient.count({ where }),
  ]);

  return {
    data: patients,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

const getPatientById = async (id: string) => {
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      doctor: true,
    },
  });

  if (!patient) {
    throw new Error("Patient not found");
  }

  return patient;
};

const createPatient = async (payload: ICreatePatient) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: payload.doctorId },
  });

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  const patient = await prisma.patient.create({
    data: {
      ...payload,
      name: payload.name.trim(),
      condition: payload.condition?.trim(),
      address: payload.address?.trim(),
      phone: payload.phone?.trim(),
      doctorId: payload.doctorId,
    },
    include: {
      doctor: true,
    },
  });

  return patient;
};

const updatePatient = async (id: string, payload: IUpdatePatient) => {
  const existingPatient = await prisma.patient.findUnique({ where: { id } });

  if (!existingPatient) {
    throw new Error("Patient not found");
  }

  const updatedPatient = await prisma.patient.update({
    where: { id },
    data: {
      ...payload,
      ...(payload.name ? { name: payload.name.trim() } : {}),
      ...(payload.condition ? { condition: payload.condition.trim() } : {}),
      ...(payload.address ? { address: payload.address.trim() } : {}),
      ...(payload.phone ? { phone: payload.phone.trim() } : {}),
      ...(payload.doctorId ? { doctorId: payload.doctorId } : {}),
    },
    include: {
      doctor: true,
    },
  });

  return updatedPatient;
};

const deletePatient = async (id: string) => {
  const existingPatient = await prisma.patient.findUnique({ where: { id } });

  if (!existingPatient) {
    throw new Error("Patient not found");
  }

  await prisma.patient.delete({ where: { id } });

  return { id };
};

export const PatientService = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
