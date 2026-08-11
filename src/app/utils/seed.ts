import bcrypt from "bcryptjs";
import config from "../config";
import { prisma } from "../lib/prisma";
import { Role } from "../../generated/prisma";

// create tester admin
export const seedTesterAdmin = async () => {
  try {
    if (
      !config.tester_admin_email ||
      !config.tester_admin_name ||
      !config.tester_admin_password
    ) {
      throw new Error(
        "Tester Admin Name, Email, or Password Missing In Env File!",
      );
    }

    const isTesterAdminExist = await prisma.user.findUnique({
      where: {
        email: config.tester_admin_email,
      },
    });

    if (isTesterAdminExist) {
      return;
    }

    const hashedPassword = await bcrypt.hash(
      config.tester_admin_password,
      Number(config.bcrypt_salt_rounds) || 10,
    );

    const testerAdmin = await prisma.user.create({
      data: {
        name: config.tester_admin_name,
        email: config.tester_admin_email,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });
  } catch (error) {
    console.error("Error Seeding Tester Admin : ", error);
    // Do not call prisma.user.delete here; if the DB connection is broken, it will throw another error.
  }
};
