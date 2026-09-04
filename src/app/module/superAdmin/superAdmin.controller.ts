import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
import { SuperAdminService } from "./superAdmin.service";

const getAllSuperAdmins = catchAsync(async (req: Request, res: Response) => {
  const superAdmins = await SuperAdminService.getAllSuperAdmins();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Super Admins retrieved successfully",
    data: superAdmins,
  });
});

const getSuperAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const superAdmin = await SuperAdminService.getSuperAdminById(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Super Admin retrieved successfully",
    data: superAdmin,
  });
});

const updateSuperAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const superAdminData = req.body;

  const updatedSuperAdmin = await SuperAdminService.updateSuperAdmin(
    id as string,
    superAdminData,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Super Admin updated successfully",
    data: updatedSuperAdmin,
  });
});

const softDeleteSuperAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedSuperAdmin = await SuperAdminService.softDeleteSuperAdmin(
    id as string,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Super Admin deleted successfully",
    data: deletedSuperAdmin,
  });
});

export const SuperAdminController = {
  getAllSuperAdmins,
  getSuperAdminById,
  updateSuperAdmin,
  softDeleteSuperAdmin,
};
