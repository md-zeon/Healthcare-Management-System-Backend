import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import status from "http-status";
import sendResponse from "../../shared/sendResponse";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await UserService.createDoctor(payload);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

export const UserController = {
  createDoctor,
};
