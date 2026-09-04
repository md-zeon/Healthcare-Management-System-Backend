import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateDoctorPayload } from "./doctor.interface";

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
      specialties: {
        include: {
          specialty: true,
        },
      },
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
  // 1. Extract data from payload
  const { specialties, doctor: doctorData } = payload;

  // 2. check if the doctor exists
  const doctorExists = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });

  if (!doctorExists) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  await prisma.$transaction(async (tx) => {
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

    if (specialties && specialties.length > 0) {
      for (const specialty of specialties) {
        const { specialtyId, shouldDelete } = specialty;

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
  const doctor = await getDoctorById(id);

  return doctor;
};

// const deleteDoctor = async (id: string) => {};
// const deleteDoctor = async (id: string) => {}; // Soft delete

export const DoctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
};
