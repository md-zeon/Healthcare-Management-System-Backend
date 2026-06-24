import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { DoctorService } from "./doctor.service";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const doctors = await DoctorService.getAllDoctors();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctors retrieved successfully",
    data: doctors,
  });
});

// TODO: Implement the following controller functions
// const getDoctorById = catchAsync(async (req: Request, res: Response) => {});
// const updateDoctor = catchAsync(async (req: Request, res: Response) => {});
// const deleteDoctor = catchAsync(async (req: Request, res: Response) => {});

export const DoctorController = {
  getAllDoctors,
};
