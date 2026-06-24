import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

interface IRegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

const registerPatient = async (payload: IRegisterPatientPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  if (!data.user) {
    throw new Error("Failed to register patient");
  }
  try {
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name,
          email,
        },
      });
      return patientTx;
    });

    return {
      ...data,
      patient,
    };
  } catch (error) {
    console.log("Transaction error:", error);

    // If the transaction fails, delete the user that was created in better-auth to avoid orphaned users in the database
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });

    throw new Error("Failed to register patient", { cause: error });
  }
};

interface ILoginUserPayload {
  email: string;
  password: string;
}

const loginUser = async (payload: ILoginUserPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (data.user.status === UserStatus.BLOCKED) {
    throw new Error("Your account has been blocked. Please contact support.");
  }

  if (data.user.status === UserStatus.DELETED) {
    throw new Error("Your account has been deleted. Please contact support.");
  }

  return data;
};

const AuthService = {
  registerPatient,
  loginUser,
};
export default AuthService;
