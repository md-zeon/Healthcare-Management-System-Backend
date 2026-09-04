import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AdminService } from "./admin.service";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const admins = await AdminService.getAllAdmins();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admins retrieved successfully",
    data: admins,
  });
});

const getAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const admin = await AdminService.getAdminById(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admin retrieved successfully",
    data: admin,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const adminData = req.body;

  const updatedAdmin = await AdminService.updateAdmin(id as string, adminData);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admin updated successfully",
    data: updatedAdmin,
  });
});

const softDeleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedAdmin = await AdminService.softDeleteAdmin(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admin deleted successfully",
    data: deletedAdmin,
  });
});

export const AdminController = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  softDeleteAdmin,
};
