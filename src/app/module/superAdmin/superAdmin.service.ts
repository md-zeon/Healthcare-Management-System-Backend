import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateSuperAdminPayload } from "./superAdmin.interface";
import { UserStatus } from "../../../generated/prisma/browser";

const getAllSuperAdmins = async () => {
  // 1. Fetch all super admins from the database (non-deleted)
  const superAdmins = await prisma.superAdmin.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
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

  // 2. Return the super admins
  return superAdmins;
};

const getSuperAdminById = async (id: string) => {
  const superAdmin = await prisma.superAdmin.findUnique({
    where: { id, isDeleted: false },
    include: {
      user: true,
    },
  });

  if (!superAdmin) {
    throw new AppError(status.NOT_FOUND, "Super Admin not found");
  }

  return superAdmin;
};

const updateSuperAdmin = async (
  id: string,
  payload: IUpdateSuperAdminPayload,
) => {
  // 1. Check if the super admin exists and is not deleted
  const superAdminExists = await prisma.superAdmin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!superAdminExists) {
    throw new AppError(status.NOT_FOUND, "Super Admin not found");
  }

  // 2. Update the super admin data
  const updatedSuperAdmin = await prisma.superAdmin.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });

  // 3. Return the updated super admin
  return updatedSuperAdmin;
};

const softDeleteSuperAdmin = async (id: string) => {
  // 1. Check if the super admin exists and is not already deleted
  const superAdminExists = await prisma.superAdmin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!superAdminExists) {
    throw new AppError(status.NOT_FOUND, "Super Admin not found");
  }

  // 2. Soft delete the super admin by setting isDeleted to true
  await prisma.$transaction(async (tx) => {
    await tx.superAdmin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    // 3. Soft delete the associated user by setting isDeleted to true and updating the status
    await tx.user.update({
      where: { id: superAdminExists.userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });
    // 4. delete all sessions associated with the user
    await tx.session.deleteMany({
      where: {
        userId: superAdminExists.userId,
      },
    });
  });

  // 3. Return the soft-deleted super admin
  return { message: "Super Admin deleted successfully" };
};

export const SuperAdminService = {
  getAllSuperAdmins,
  getSuperAdminById,
  updateSuperAdmin,
  softDeleteSuperAdmin,
};
