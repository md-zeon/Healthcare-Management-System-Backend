import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
// import { prisma } from "../../lib/prisma";

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

  // TODO: Create patient Profile in transaction after signup is successful in user model
  //   const patient = await prisma.$transaction(async (tx) => {});

  //   TODO: return the patient profile along with the user data after successful registration
  return data;
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
