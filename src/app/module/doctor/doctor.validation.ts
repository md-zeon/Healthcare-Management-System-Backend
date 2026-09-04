import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

const updateDoctorValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    profilePhoto: z.url("Invalid URL format").optional(),
    contactNumber: z.string().optional(),
    registrationNumber: z.string().optional(),
    experience: z
      .int("Experience must be a whole number")
      .min(0, "Experience cannot be negative")
      .optional(),
    gender: z.enum(Object.values(Gender), "Invalid gender value").optional(),
    appointmentFee: z
      .number()
      .positive("Appointment fee must be positive")
      .optional(),
    qualification: z.string().optional(),
    currentWorkingPlace: z.string().optional(),
    designation: z.string().optional(),
    specialties: z
      .array(
        z.object({
          specialtyId: z.uuid("Each specialty ID must be a valid UUID"),
          shouldDelete: z.boolean().default(false).optional(),
        }),
      )
      .optional(),
  }),
});

export const DoctorValidation = {
  updateDoctorValidationSchema,
};
