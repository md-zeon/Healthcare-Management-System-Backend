import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import envVars from "../../config/env";
import { cookieUtils } from "./cookie";
import { Response } from "express";
import getAge from "./getAge";

const getAccessToken = (payload: JwtPayload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN } as SignOptions,
  );

  return accessToken;
};

const getRefreshToken = (payload: JwtPayload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN } as SignOptions,
  );

  return refreshToken;
};

const setAccessTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: getAge(envVars.ACCESS_TOKEN_EXPIRES_IN, "ms", 60 * 60 * 24 * 1000), // fallback to 1 day in milliseconds if parsing fails
  });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: getAge(
      envVars.REFRESH_TOKEN_EXPIRES_IN,
      "ms",
      60 * 60 * 24 * 7 * 1000, // fallback to 7 days in milliseconds if parsing fails
    ),
  });
};

const setBetterAuthSessionCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: getAge(
      envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
      "ms",
      60 * 60 * 24 * 1000, // fallback to 1 day in milliseconds if parsing fails
    ),
  });
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie,
};
