import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

const updateDoctorValidationSchema = z.object({
  name: z.string("Name must be a string").optional(),
  profilePhoto: z.url("Profile photo must be a valid URL").optional(),
  contactNumber: z.string("Contact number must be a string").optional(),
  address: z.string("Address must be a string").optional(),
  registrationNumber: z
    .string("Registration number must be a string")
    .optional(),
  experience: z
    .int("Experience must be a whole number")
    .min(0, "Experience cannot be negative")
    .optional(),
  gender: z.enum(Object.values(Gender), "Invalid gender value").optional(),
  appointmentFee: z
    .number("Appointment fee must be a number")
    .positive("Appointment fee must be positive")
    .optional(),
  qualifications: z.string("Qualifications must be a string").optional(),
  currentWorkingPlace: z
    .string("Current working place must be a string")
    .optional(),
  designation: z.string("Designation must be a string").optional(),
  specialties: z
    .array(
      z.object({
        specialtyId: z.uuid("Each specialty ID must be a valid UUID"),
          shouldDelete: z.boolean().default(false).optional(),
      }),
      "Specialties must be an array",
    )
    .optional(),
});

export const DoctorValidation = {
  updateDoctorValidationSchema,
};
