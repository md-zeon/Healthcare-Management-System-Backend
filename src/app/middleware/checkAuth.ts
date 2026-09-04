import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import status from "http-status";
import { cookieUtils } from "../utils/cookie";
import AppError from "../errorHelpers/AppError";
import { jwtUtils } from "../utils/jwt";
import envVars from "../../config/env";
import { prisma } from "../lib/prisma";

const checkAuth = (...authRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // session token verification
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access. No session token provided.",
        );
      }

      const sessionExists = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      if (!sessionExists) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access. Invalid or expired session.",
        );
      }

      // Check if the user associated with the session exists
      const user = sessionExists.user;

      if (!user) {
        throw new AppError(
          status.UNAUTHORIZED,
          "User not found for this session.",
        );
      }

      // Check if the session is about to expire and set headers accordingly
      const now = new Date();
      const expiresAt = new Date(sessionExists.expiresAt);
      const createdAt = new Date(sessionExists.createdAt);

      const sessionLifetime = expiresAt.getTime() - createdAt.getTime();
      if (sessionLifetime <= 0) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Invalid session lifetime. Please log in again.",
        );
      }
      const timeRemaining = expiresAt.getTime() - now.getTime();
      const timeRemainingPercentage = (timeRemaining / sessionLifetime) * 100;

      if (timeRemainingPercentage < 20) {
        res.setHeader("X-Session-Refresh", "true");
        res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
        res.setHeader("X-Time-Remaining", timeRemaining.toString());

        console.log("Session Expiring Soon!!");
      }

      if (user.status === UserStatus.BLOCKED) {
        throw new AppError(
          status.FORBIDDEN,
          "Your account has been blocked. Please contact support.",
        );
      } else if (user.status === UserStatus.DELETED) {
        throw new AppError(
          status.FORBIDDEN,
          "Your account has been deleted. Please contact support.",
        );
      }

      if (user.isDeleted) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden access. Your account has been deleted. Please contact support.",
        );
      }

      if (authRoles.length > 0 && !authRoles.includes(user.role)) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden access. You do not have permission to access this resource.",
        );
      }

      // access token verification
      const accessToken = cookieUtils.getCookie(req, "accessToken");

      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access. No access token provided.",
        );
      }

      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );

      if (!verifiedToken.success) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access. Invalid access token.",
        );
      }

      if (user.id !== verifiedToken.data?.userId) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Session and access token mismatch.",
        );
      }

      req.user = {
        userId: user.id,
        role: user.role,
        email: user.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkAuth;
