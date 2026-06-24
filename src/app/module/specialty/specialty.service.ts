import { Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpecialty = async (payload: Specialty): Promise<Specialty> => {
  const specialty = await prisma.specialty.create({
    data: payload,
  });

  return specialty;
};

const getAllSpecialties = async (): Promise<Specialty[]> => {
  const specialties = await prisma.specialty.findMany();

  return specialties;
};

const updateSpecialty = async (
  id: string,
  payload: Partial<Specialty>,
): Promise<Specialty | null> => {
  const updatedSpecialty = await prisma.specialty.update({
    where: { id },
    data: payload,
  });

  return updatedSpecialty;
};

const deleteSpecialty = async (id: string): Promise<Specialty | null> => {
  const deletedSpecialty = await prisma.specialty.delete({
    where: { id },
  });

  return deletedSpecialty;
};

export const SpecialtyService = {
  createSpecialty,
  getAllSpecialties,
  updateSpecialty,
  deleteSpecialty,
};
