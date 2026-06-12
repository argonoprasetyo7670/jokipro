import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Credentials received:", { email: credentials?.email, hasPassword: !!credentials?.password });
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        console.log("User found:", user ? user.email : "Not found");

        if (!user || !user.passwordHash) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        console.log("Passwords match:", passwordsMatch);

        if (passwordsMatch) {
          // You can map fields if needed, but Next-Auth usually looks for id, email, name, image
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        }

        return null;
      }
    })
  ]
});
