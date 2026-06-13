import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { cookies } from "next/headers";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.passwordHash) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (passwordsMatch) {
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
  ],
  events: {
    async createUser({ user }) {
      // When a new user is created via Google OAuth,
      // read the pending_role cookie to assign their role
      try {
        const cookieStore = await cookies();
        const pendingRole = cookieStore.get("pending_role")?.value;

        if (pendingRole && user.id && (pendingRole === "CLIENT" || pendingRole === "WORKER")) {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: pendingRole },
          });

          // Create profile based on role
          if (pendingRole === "CLIENT") {
            await prisma.clientProfile.upsert({
              where: { userId: user.id },
              update: {},
              create: { userId: user.id },
            });
          }
          // WORKER will go through onboarding

          console.log(`[Auth] Google user ${user.email} assigned role: ${pendingRole}`);
        }

        // Clear the cookie
        cookieStore.delete("pending_role");
      } catch (error) {
        console.error("[Auth] Error assigning role to Google user:", error);
      }
    },
  },
});

