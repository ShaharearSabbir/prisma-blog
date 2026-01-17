import { User } from "better-auth/types";

global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
