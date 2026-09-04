import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateDoctorPayload } from "./doctor.interface";
import { UserStatus } from "../../../generated/prisma/enums";

const getAllDoctors = async () => {
  // 1. Fetch all doctors from the database (non-deleted)
  const result = await prisma.doctor.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      profilePhoto: true,
      contactNumber: true,
      registrationNumber: true,
      experience: true,
      gender: true,
      appointmentFee: true,
      qualifications: true,
      currentWorkingPlace: true,
      designation: true,
      averageRating: true,
      address: true,
      specialties: {
        select: {
          specialty: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  // 2. flatten the specialties array to only include the specialty object
  const doctors = result.map((doctor) => ({
    ...doctor,
    specialties: doctor.specialties.map((specialty) => specialty.specialty),
  }));

  // 3. Return the doctors
  return doctors;
};

const getDoctorById = async (id: string) => {
  const result = await prisma.doctor.findUnique({
    where: { id, isDeleted: false },
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
      appointments: {
        include: {
          patient: true,
          schedule: true,
          prescription: true,
        },
      },
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
      reviews: true,
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  const doctor = {
    ...result,
    specialties: result.specialties.map((s) => s.specialty),
  };

  return doctor;
};

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
  // 1. check if the doctor exists and is not deleted
  const doctorExists = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!doctorExists) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  // 2. Separate the specialties from the rest of the doctor data
  const { specialties, ...doctorData } = payload;

  // 3. Use a transaction to update the doctor and handle specialties
  await prisma.$transaction(async (tx) => {
    // Update the doctor data if provided
    if (doctorData) {
      await tx.doctor.update({
        where: {
          id,
        },
        data: {
          ...doctorData,
        },
      });
    }

    // Handle specialties if provided
    if (specialties && specialties.length > 0) {
      for (const specialty of specialties) {
        const { specialtyId, shouldDelete } = specialty;

        // If shouldDelete is true, delete the specialty association; otherwise, upsert it
        if (shouldDelete) {
          await tx.doctorSpecialty.delete({
            where: {
              doctorId_specialtyId: {
                doctorId: id,
                specialtyId,
              },
            },
          });
        } else {
          // Upsert the specialty association
          await tx.doctorSpecialty.upsert({
            where: {
              doctorId_specialtyId: {
                doctorId: id,
                specialtyId,
              },
            },
            update: {},
            create: {
              doctorId: id,
              specialtyId,
            },
          });
        }
      }
    }
  });

  // 4. Return the updated doctor
  const doctor = await getDoctorById(id);

  return doctor;
};

const softDeleteDoctor = async (id: string) => {
  // 1. Check if the doctor exists and is not already deleted
  const doctorExists = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!doctorExists) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  await prisma.$transaction(async (tx) => {
    // 2. Soft delete the doctor by setting isDeleted to true
    await tx.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    // 3. Soft delete the associated user by setting isDeleted to true and updating the status
    await tx.user.update({
      where: { id: doctorExists.userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });

    // 4. Soft delete all sessions associated with the user
    await tx.session.deleteMany({
      where: {
        userId: doctorExists.userId,
      },
    });

    // 5. Soft delete all doctor specialties associated with the doctor
    await tx.doctorSpecialty.deleteMany({
      where: {
        doctorId: id,
      },
    });
  });
  return { message: "Doctor deleted successfully" };
};

export const DoctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  softDeleteDoctor,
};
