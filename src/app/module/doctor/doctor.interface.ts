import { Gender } from "../../../generated/prisma/enums";

export interface IUpdateDoctorSpecialityPayload {
    specialtyId: string;
    shouldDelete?: boolean;
}

export interface IUpdateDoctorPayload {
    doctor?: {
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
    };
    specialties?: IUpdateDoctorSpecialityPayload[];
}