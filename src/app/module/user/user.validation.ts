import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorZodSchema = z.object({
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long"),
  doctor: z.object({
    name: z
      .string("Name is required")
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must be at most 50 characters long"),
    email: z.email("Invalid email address"),
    contactNumber: z
      .string("Contact number is required")
      .min(11, "Contact number must be at least 11 digits long")
      .max(14, "Contact number must be at most 14 digits long")
      .optional(),
    address: z
      .string("Address is required")
      .min(10, "Address must be at least 10 characters long")
      .max(100, "Address must be at most 100 characters long")
      .optional(),

    registrationNumber: z.string("Registration number is required"),
    experience: z
      .int("Experience must be an integer")
      .min(0, "Experience must be a non-negative integer"),
    gender: z.enum(
      [Gender.MALE, Gender.FEMALE],
      "Gender must be either 'MALE' or 'FEMALE'",
    ),
    appointmentFee: z
      .number("Appointment fee must be a number")
      .nonnegative("Appointment fee cannot be negative"),
    qualifications: z
      .string("Qualifications are required")
      .min(2, "Qualifications must be at least 2 characters long")
      .max(500, "Qualifications must be at most 500 characters long"),
    currentWorkingPlace: z
      .string("Current working place is required")
      .min(4, "Current working place must be at least 4 characters long")
      .max(100, "Current working place must be at most 100 characters long"),
    designation: z
      .string("Designation is required")
      .min(2, "Designation must be at least 2 characters long")
      .max(50, "Designation must be at most 50 characters long"),
  }),

  specialties: z
    .array(
      z.uuid("Specialty ID must be a valid UUID"),
      "Specialties must be an array of valid UUIDs",
    )
    .min(1, "At least one specialty is required"),
});

export const createAdminZodSchema = z.object({
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long"),
  admin: z.object({
    name: z
      .string("Name is required")
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must be at most 50 characters long"),
    email: z.email("Invalid email address"),
    profilePhoto: z.url("Profile photo must be a valid URL").optional(),
    contactNumber: z
      .string("Contact number is required")
      .min(11, "Contact number must be at least 11 digits long")
      .max(14, "Contact number must be at most 14 digits long"),
  }),
});

export const createSuperAdminZodSchema = z.object({
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long"),
  superAdmin: z.object({
    name: z
      .string("Name is required")
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must be at most 50 characters long"),
    email: z.email("Invalid email address"),
    profilePhoto: z.url("Profile photo must be a valid URL").optional(),
    contactNumber: z
      .string("Contact number is required")
      .min(11, "Contact number must be at least 11 digits long")
      .max(14, "Contact number must be at most 14 digits long"),
  }),
});
