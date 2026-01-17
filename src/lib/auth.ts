import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import sendEmail from "../utils/sendEmail";
import generateVerificationEmail from "../utils/email_templates/emailVerification";

// 1. Define Additional User Fields
const additionalUserFields = {
  role: {
    type: "string" as const,
    defaultValue: "USER",
    required: false,
  },
  phone: {
    type: "string" as const,
    required: false,
  },
  status: {
    type: "string" as const,
    defaultValue: "ACTIVE",
    required: false,
  },
};

// 2. Main Auth Configuration
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.APP_URL!],

  user: {
    additionalFields: additionalUserFields,
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
      const { html, text } = generateVerificationEmail(
        user.name,
        verificationUrl,
      );

      try {
        await sendEmail(user.email, "Verify your email address", html, text);
      } catch (error) {
        console.error("Failed to send verification email:", error);
        throw error;
      }
    },
  },

  socialProviders: {
    google: {
      accessType: "offline",
      prompt: "select_account consent",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
