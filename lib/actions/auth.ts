"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(credentials: Record<string, string>) {
  try {
    console.log("Attempting login with:", { email: credentials.email, hasPassword: !!credentials.password });
    await signIn("credentials", {
      ...credentials,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email atau password salah." };
        default:
          return { error: "Terjadi kesalahan saat login." };
      }
    }
    throw error;
  }
}
