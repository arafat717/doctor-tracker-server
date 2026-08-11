import { prisma } from "../../lib/prisma";

const getDashboardSummary = async () => {
  const [totalDoctors, totalPatients, doctors, patientByCondition] =
    await Promise.all([
      prisma.doctor.count(),
      prisma.patient.count(),
      prisma.doctor.findMany({
        select: {
          id: true,
          name: true,
          specialization: true,
          hospital: true,
          createdAt: true,
          _count: {
            select: { patients: true },
          },
        },
        orderBy: [{ patients: { _count: "desc" } }, { name: "asc" }],
      }),
      prisma.patient.groupBy({
        by: ["condition"],
        _count: { condition: true },
      }),
    ]);

  const patientsPerDoctor = doctors.map((doctor) => ({
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialization: doctor.specialization,
    hospital: doctor.hospital,
    patientCount: doctor._count.patients,
  }));

  const doctorDateMap = new Map<string, number>();
  const patientDateMap = new Map<string, number>();

  for (const doctor of doctors) {
    const createdDate = doctor.createdAt.toISOString().slice(0, 10);
    doctorDateMap.set(createdDate, (doctorDateMap.get(createdDate) ?? 0) + 1);
  }

  const patientDates = await prisma.patient.findMany({
    select: { createdAt: true },
  });

  for (const patient of patientDates) {
    const createdDate = patient.createdAt.toISOString().slice(0, 10);
    patientDateMap.set(createdDate, (patientDateMap.get(createdDate) ?? 0) + 1);
  }

  return {
    totals: {
      totalDoctors,
      totalPatients,
    },
    patientsPerDoctor,
    // doctors,
    patientsByCondition: patientByCondition.map((item) => ({
      condition: item.condition ?? "Unknown",
      count: item._count.condition,
    })),
    dateBasedStatistics: {
      doctorsByDate: Array.from(doctorDateMap.entries()).map(
        ([date, count]) => ({
          date,
          count,
        }),
      ),
      patientsByDate: Array.from(patientDateMap.entries()).map(
        ([date, count]) => ({
          date,
          count,
        }),
      ),
    },
  };
};

export const DashboardService = {
  getDashboardSummary,
};
