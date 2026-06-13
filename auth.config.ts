import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    // Providers added in auth.ts to avoid edge runtime issues with some adapters
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isAuthRoute = nextUrl.pathname === "/" || nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

      if (isDashboard) {
        if (!isLoggedIn) return false; // Redirect unauthenticated users to login page

        const role = auth?.user?.role as string | undefined;

        // Role-based protection map
        const adminOnlyRoutes = ["/dashboard/clients", "/dashboard/users", "/dashboard/admin-keren"];
        const clientOnlyRoutes = ["/dashboard/tasks/new", "/dashboard/my-tasks"];
        const clientAdminRoutes = ["/dashboard/workers"];
        const workerClientRoutes = ["/dashboard/orders"];

        // Check Admin only
        if (adminOnlyRoutes.some(route => nextUrl.pathname.startsWith(route))) {
          if (role !== "ADMIN") return Response.redirect(new URL("/dashboard", nextUrl));
        }

        // Check Client only
        if (clientOnlyRoutes.some(route => nextUrl.pathname.startsWith(route))) {
          if (role !== "CLIENT") return Response.redirect(new URL("/dashboard", nextUrl));
        }

        // Check Client & Admin
        if (clientAdminRoutes.some(route => nextUrl.pathname.startsWith(route))) {
          if (role !== "CLIENT" && role !== "ADMIN") return Response.redirect(new URL("/dashboard", nextUrl));
        }

        // Check Worker & Client only
        if (workerClientRoutes.some(route => nextUrl.pathname.startsWith(route))) {
          if (role !== "CLIENT" && role !== "WORKER") return Response.redirect(new URL("/dashboard", nextUrl));
        }

        return true;
      }

      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
