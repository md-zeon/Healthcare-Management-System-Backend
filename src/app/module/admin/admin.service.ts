import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateAdminPayload } from "./admin.interface";
import { UserStatus } from "../../../generated/prisma/enums";
import { IRequestUser } from "../../interfaces/requestUser.interface";

const getAllAdmins = async () => {
  // 1. Fetch all admins from the database (non-deleted)
  const admins = await prisma.admin.findMany({
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

  // 2. Return the admins
  return admins;
};

const getAdminById = async (id: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id, isDeleted: false },
    include: {
      user: true,
    },
  });

  if (!admin) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

  return admin;
};

const updateAdmin = async (id: string, payload: IUpdateAdminPayload) => {
  // 1. Check if the admin exists and is not deleted
  const adminExists = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!adminExists) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

  // 2. Update the admin data
  const updatedAdmin = await prisma.admin.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });

  // 3. Return the updated admin
  return updatedAdmin;
};

const softDeleteAdmin = async (id: string, user: IRequestUser) => {
  // 1. Check if the admin exists and is not already deleted
  const adminExists = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!adminExists) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

  if (adminExists.userId === user.userId) {
    throw new AppError(
      status.BAD_REQUEST,
      "You cannot delete your own account",
    );
  }

  // 2. Soft delete the admin by setting isDeleted to true
  await prisma.$transaction(async (tx) => {
    await tx.admin.update({
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
      where: { id: adminExists.userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });
    // 4. delete all sessions associated with the user
    await tx.session.deleteMany({
      where: {
        userId: adminExists.userId,
      },
    });
  });

  return { message: "Admin deleted successfully" };
};

export const AdminService = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  softDeleteAdmin,
};
