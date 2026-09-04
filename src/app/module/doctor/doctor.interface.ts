import { Gender } from "../../../generated/prisma/enums";

export interface IUpdateDoctorPayload {
  name?: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  registrationNumber?: string;
  experience?: number;
  gender?: Gender;
  appointmentFee?: number;
  qualifications?: string;
  currentWorkingPlace?: string;
  designation?: string;
  specialties?: {
    specialtyId: string;
    shouldDelete: boolean;
  }[];
}
