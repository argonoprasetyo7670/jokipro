# 🔒 Fitur 12: Authorization & Middleware

## Deskripsi

EduTasky menggunakan NextAuth middleware dan callback-based authorization untuk memproteksi route berdasarkan status login dan role pengguna.

## File Terkait

| File | Fungsi |
|------|--------|
| `middleware.ts` | NextAuth middleware entry point |
| `auth.config.ts` | Authorization callbacks + route rules |
| `auth.ts` | NextAuth providers & adapter |

## Middleware

```typescript
// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Jalankan middleware pada semua route KECUALI:
  // - /api
  // - /_next/static
  // - /_next/image
  // - file .png
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
```

## Authorization Logic

Semua logic authorization ada di callback `authorized()` di `auth.config.ts`:

### 1. Dashboard Protection (Login Required)

```typescript
const isDashboard = nextUrl.pathname.startsWith("/dashboard");

if (isDashboard) {
  if (!isLoggedIn) return false; // Redirect ke /login
  // ... role checks
  return true;
}
```

### 2. Role-Based Access Control

```typescript
// Admin Only Routes
const adminOnlyRoutes = [
  "/dashboard/clients",
  "/dashboard/users",
  "/dashboard/admin-keren"
];

if (adminOnlyRoutes.some(route => nextUrl.pathname.startsWith(route))) {
  if (role !== "ADMIN") return Response.redirect(new URL("/dashboard", nextUrl));
}

// Client Only Routes
const clientOnlyRoutes = [
  "/dashboard/tasks/new",
  "/dashboard/my-tasks",
  "/dashboard/workers"
];

if (clientOnlyRoutes.some(route => nextUrl.pathname.startsWith(route))) {
  if (role !== "CLIENT") return Response.redirect(new URL("/dashboard", nextUrl));
}

// Worker + Client Routes
const workerClientRoutes = ["/dashboard/orders"];

if (workerClientRoutes.some(route => nextUrl.pathname.startsWith(route))) {
  if (role !== "CLIENT" && role !== "WORKER") {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }
}
```

### 3. Auth Route Redirect (sudah login)

```typescript
const isAuthRoute = nextUrl.pathname === "/" 
  || nextUrl.pathname === "/login" 
  || nextUrl.pathname === "/register";

if (isAuthRoute && isLoggedIn) {
  return Response.redirect(new URL("/dashboard", nextUrl));
}
```

## Route Access Matrix

| Route | Guest | CLIENT | WORKER | ADMIN |
|-------|:-----:|:------:|:------:|:-----:|
| `/` (Landing) | ✅ | → Dashboard | → Dashboard | → Dashboard |
| `/login` | ✅ | → Dashboard | → Dashboard | → Dashboard |
| `/register` | ✅ | → Dashboard | → Dashboard | → Dashboard |
| `/dashboard` | → Login | ✅ | ✅ | ✅ |
| `/dashboard/my-tasks` | → Login | ✅ | → Dashboard | → Dashboard |
| `/dashboard/tasks/new` | → Login | ✅ | → Dashboard | → Dashboard |
| `/dashboard/workers` | → Login | ✅ | → Dashboard | → Dashboard |
| `/dashboard/orders` | → Login | ✅ | ✅ | → Dashboard |
| `/dashboard/tasks` | → Login | ✅ | ✅ | ✅ |
| `/dashboard/profile` | → Login | ✅ | ✅ | ✅ |
| `/dashboard/users` | → Login | → Dashboard | → Dashboard | ✅ |
| `/dashboard/clients` | → Login | → Dashboard | → Dashboard | ✅ |
| `/dashboard/admin-keren` | → Login | → Dashboard | → Dashboard | ✅ |
| `/dashboard/disputes` | → Login | ✅ | ✅ | ✅ |

## Server-Side Auth Checks

Selain middleware, setiap **Server Action** juga melakukan validasi sendiri:

```typescript
// Contoh di setiap action
const session = await auth();
if (!session?.user?.id) {
  throw new Error("Anda harus login");
}

// Role check
if (session.user.role !== "WORKER") {
  throw new Error("Hanya Worker yang dapat melakukan ini");
}
```

## Worker Onboarding Gate

Di `app/dashboard/layout.tsx`, ada pengecekan tambahan khusus Worker:

```typescript
if (dbUser?.role === "WORKER") {
  const p = dbUser.workerProfile;
  const isOnboarded = p && p.bio && p.skills.length > 0 && p.university && p.major;
  if (!isOnboarded) {
    redirect("/onboarding/worker");
  }
}
```

## Lapisan Keamanan

```
Request masuk
    ↓
[1] Middleware (auth.config.ts → authorized callback)
    → Cek login status
    → Cek role-based route access
    ↓
[2] Layout (dashboard/layout.tsx)
    → Cek session
    → Cek worker onboarding
    ↓
[3] Server Action (lib/actions/*.ts)
    → Cek session
    → Cek role
    → Cek ownership (misal: tugas milik client)
    → Cek status (misal: tugas masih OPEN)
```
