import { FullUser } from "./FullUser";

global {
  namespace Express {
    interface Request {
      user?: FullUser;
    }
  }
}
