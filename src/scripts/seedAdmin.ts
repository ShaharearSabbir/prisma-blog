import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";

const seedAdmin = async () => {
  try {
    const adminData = {
      name: "admin",
      email: "admin@admin.com",
      password: "admin1234",
      role: UserRole.ADMIN,
    };
    const isUserExist = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (isUserExist) {
      throw new Error("User already exist");
    }

    const signupAdmin = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      },
    );

    if (signupAdmin.ok) {
      const updateAdmin = await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });

      console.log(updateAdmin);
    }
  } catch (error) {
    console.error(error);
  }
};

seedAdmin();
