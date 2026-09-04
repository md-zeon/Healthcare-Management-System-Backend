import status from "http-status";
import { Role, Specialty } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateAdminPayload, ICreateDoctorPayload, ICreateSuperAdminPayload } from "./user.interface";

const createDoctor = async (payload: ICreateDoctorPayload) => {
  const specialties: Specialty[] = [];

  // Validate specialties
  for (const specialtyId of payload.specialties) {
    const specialty = await prisma.specialty.findUnique({
      where: {
        id: specialtyId,
      },
    });
    if (!specialty) {
      throw new AppError(
        status.NOT_FOUND,
        `Specialty with ID ${specialtyId} not found`,
      );
    }

    specialties.push(specialty);
  }

  // Check if user with the same email already exists
  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });

  if (userExists) {
    throw new AppError(
      status.CONFLICT,
      `User with email ${payload.doctor.email} already exists`,
    );
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      password: payload.password,
      name: payload.doctor.name,
      role: Role.DOCTOR,
      needPasswordChange: true,
    },
  });

  if (!userData.user) {
    throw new AppError(status.BAD_REQUEST, "Failed to create user");
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const doctorData = await tx.doctor.create({
        data: {
          userId: userData.user.id,
          ...payload.doctor,
        },
      });

      const doctorSpecialtiesData = specialties.map((specialty) => ({
        doctorId: doctorData.id,
        specialtyId: specialty.id,
      }));

      await tx.doctorSpecialty.createMany({
        data: doctorSpecialtiesData,
      });

      const doctor = await tx.doctor.findUnique({
        where: {
          id: doctorData.id,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          registrationNumber: true,
          experience: true,
          gender: true,
          appointmentFee: true,
          qualifications: true,
          currentWorkingPlace: true,
          designation: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              emailVerified: true,
              image: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          specialties: {
            select: {
              specialty: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      return doctor;
    });

    return result;
  } catch (error) {
    console.log("Transaction Error:", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });

    throw new AppError(
      status.BAD_REQUEST,
      "Failed to create doctor and specialties",
    );
  }
};

const createAdmin = async (payload: ICreateAdminPayload) => {
  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.admin.email,
    },
  });

  if (userExists) {
    throw new AppError(
      status.CONFLICT,
      `User with email ${payload.admin.email} already exists`,
    );
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.admin.email,
      password: payload.password,
      name: payload.admin.name,
      role: Role.ADMIN,
      needPasswordChange: true,
      rememberMe: false,
    },
  });

  // if user not created then throw error
  if (!userData.user) {
    throw new AppError(status.BAD_REQUEST, "Failed to create user");
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create admin
      const admin = await tx.admin.create({
        data: {
          userId: userData.user.id,
          name: payload.admin.name,
          email: payload.admin.email,
          profilePhoto: payload.admin.profilePhoto,
          contactNumber: payload.admin.contactNumber,
        },
      });

      // fetch created admin with user data
      const adminData = await tx.admin.findUnique({
        where: {
          id: admin.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              emailVerified: true,
              image: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      return adminData;
    });

    return result;
  } catch (error) {
    console.log("Transaction Error:", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });

    throw new AppError(status.BAD_REQUEST, "Failed to create admin");
  }
};

const createSuperAdmin = async (payload: ICreateSuperAdminPayload) => {
  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.superAdmin.email,
    },
  });

  if (userExists) {
    throw new AppError(
      status.CONFLICT,
      `User with email ${payload.superAdmin.email} already exists`,
    );
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.superAdmin.email,
      password: payload.password,
      name: payload.superAdmin.name,
      role: Role.SUPER_ADMIN,
      needPasswordChange: true,
      rememberMe: false,
    },
  });

  // if user not created then throw error
  if (!userData.user) {
    throw new AppError(status.BAD_REQUEST, "Failed to create user");
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create super admin
      const superAdmin = await tx.superAdmin.create({
        data: {
          userId: userData.user.id,
          name: payload.superAdmin.name,
          email: payload.superAdmin.email,
          profilePhoto: payload.superAdmin.profilePhoto,
          contactNumber: payload.superAdmin.contactNumber,
        },
      });

      // fetch created super admin with user data
      const superAdminData = await tx.superAdmin.findUnique({
        where: {
          id: superAdmin.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              emailVerified: true,
              image: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      return superAdminData;
    });

    return result;
  } catch (error) {
    console.log("Transaction Error:", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });

    throw new AppError(status.BAD_REQUEST, "Failed to create super admin");
  }
};

export const UserService = {
  createDoctor,
  createAdmin,
  createSuperAdmin
};
