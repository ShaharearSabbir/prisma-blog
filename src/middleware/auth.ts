import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import sendRes from "../utils/sendRes";
import { User } from "better-auth/types";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as HeadersInit,
      });

      if (!session) {
        sendRes(res, 401, false, "unauthorized access");
      }

      if (!session?.user.emailVerified) {
        sendRes(res, 403, false, "email verified required");
      }

      const currentUserRole = session?.user.role as UserRole;

      if (roles && roles.length > 0 && !roles.includes(currentUserRole)) {
        sendRes(res, 401, false, "unauthorized access");
      }

      req.user = session?.user as User;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
