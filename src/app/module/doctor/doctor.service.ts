import { prisma } from "../../lib/prisma";
import type {
  ICreateDoctor,
  ICreateDoctorPatient,
  IDoctorFilters,
  IUpdateDoctor,
} from "./doctor.interface";

const normalizePage = (value?: number) => Number(value ?? 1);
const normalizeLimit = (value?: number) => Number(value ?? 10);

const buildDoctorWhere = (filters: IDoctorFilters) => {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { specialization: { contains: filters.search, mode: "insensitive" } },
      { hospital: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.specialization) {
    where.specialization = {
      contains: filters.specialization,
      mode: "insensitive",
    };
  }

  if (filters.hospital) {
    where.hospital = {
      contains: filters.hospital,
      mode: "insensitive",
    };
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

const getDoctors = async (filters: IDoctorFilters) => {
  const page = normalizePage(filters.page);
  const limit = normalizeLimit(filters.limit);
  const where = buildDoctorWhere(filters);
  const skip = (page - 1) * limit;

  const [doctors, total] = await Promise.all([
    prisma.doctor.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { patients: true },
        },
      },
    }),
    prisma.doctor.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    data: doctors,
  };
};

const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: {
      patients: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  return doctor;
};

const createDoctor = async (payload: ICreateDoctor) => {
  const doctor = await prisma.doctor.create({
    data: {
      ...payload,
      email: payload.email.trim().toLowerCase(),
    },
  });

  return doctor;
};

const updateDoctor = async (id: string, payload: IUpdateDoctor) => {
  const existingDoctor = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!existingDoctor) {
    throw new Error("Doctor not found");
  }

  const updatedDoctor = await prisma.doctor.update({
    where: { id },
    data: {
      ...payload,
      ...(payload.email ? { email: payload.email.trim().toLowerCase() } : {}),
    },
  });

  return updatedDoctor;
};

const deleteDoctor = async (id: string) => {
  const existingDoctor = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!existingDoctor) {
    throw new Error("Doctor not found");
  }

  await prisma.doctor.delete({
    where: { id },
  });

  return { id };
};

const getDoctorPatients = async (doctorId: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    include: {
      patients: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  return doctor;
};

const addPatientToDoctor = async (
  doctorId: string,
  payload: ICreateDoctorPatient,
) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
  });

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  return prisma.patient.create({
    data: {
      ...payload,
      doctorId,
      name: payload.name.trim(),
      condition: payload.condition?.trim(),
      address: payload.address?.trim(),
      phone: payload.phone?.trim(),
    },
  });
};

export const DoctorService = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorPatients,
  addPatientToDoctor,
};
