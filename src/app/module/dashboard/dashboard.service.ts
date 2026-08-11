import { prisma } from "../../lib/prisma";

const getDashboardSummary = async () => {
  const [
    totalDoctors,
    totalPatients,
    doctors,
    patientByCondition,
    monthlyDoctors,
    monthlyPatients,
  ] = await Promise.all([
    prisma.doctor.count(),
    prisma.patient.count(),
    prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { patients: true },
        },
      },
      orderBy: { patients: { _count: "desc" } },
    }),
    prisma.patient.groupBy({
      by: ["condition"],
      _count: { condition: true },
    }),
    prisma.doctor.groupBy({
      by: ["createdAt"],
      _count: { createdAt: true },
    }),
    prisma.patient.groupBy({
      by: ["createdAt"],
      _count: { createdAt: true },
    }),
  ]);

  return {
    totals: {
      totalDoctors,
      totalPatients,
    },
    doctors,
    patientsByCondition: patientByCondition.map((item) => ({
      condition: item.condition ?? "Unknown",
      count: item._count.condition,
    })),
    monthlyDoctors,
    monthlyPatients,
  };
};

export const DashboardService = {
  getDashboardSummary,
};
