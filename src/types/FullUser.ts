import { auth } from "../lib/auth";

export type FullUser = typeof auth.$Infer.Session.user;
