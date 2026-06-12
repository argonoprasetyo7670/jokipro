import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Hanya jalankan middleware ini pada route yang relevan (misal semua selain file statis)
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
