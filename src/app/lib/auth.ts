import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import envVars from "../../config/env";
import getAge from "../utils/getAge";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.PATIENT,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
    },
  },
  session: {
    expiresIn: getAge(
      envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
      "s",
      60 * 60 * 24, // fallback to 1 day in seconds if parsing fails
    ),
    updateAge: getAge(
      envVars.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE,
      "s",
      60 * 60 * 24, // fallback to 1 day in seconds if parsing fails
    ),
    cookieCache: {
      enabled: true,
      maxAge: getAge(
        envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
        "s",
        60 * 60 * 24, // fallback to 1 day in seconds if parsing fails
      ),
    },
  },
});
