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

const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const doctor = await DoctorService.getDoctorById(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctor retrieved successfully",
    data: doctor,
  });
});
const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const doctorData = req.body;

  const updatedDoctor = await DoctorService.updateDoctor(
    id as string,
    doctorData,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctor updated successfully",
    data: updatedDoctor,
  });
});

// TODO: Implement the following controller functions
// const deleteDoctor = catchAsync(async (req: Request, res: Response) => {});

export const DoctorController = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  // deleteDoctor
};
