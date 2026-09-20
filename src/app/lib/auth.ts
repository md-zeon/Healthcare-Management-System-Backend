import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import envVars from "../../config/env";
import getAge from "../utils/getAge";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignup: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
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
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "Verify your email address",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        }
      },
      expiresIn: 2 * 60, // 2 minutes in seconds
      otpLength: 6, // 6 digits
    }),
  ],
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
