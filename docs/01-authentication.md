# 🔐 Fitur 01: Autentikasi

## Deskripsi

Sistem autentikasi EduTasky menggunakan **NextAuth v5 (beta)** dengan strategi **JWT**. Mendukung login via **email/password (Credentials)** dan **Google OAuth**.

## File Terkait

| File | Fungsi |
|------|--------|
| `auth.ts` | Konfigurasi utama NextAuth (providers, adapter) |
| `auth.config.ts` | Callbacks JWT/Session + route protection |
| `middleware.ts` | NextAuth middleware untuk proteksi route |
| `lib/actions/auth.ts` | Server Actions: login, register, Google login |
| `app/(auth)/layout.tsx` | Layout halaman auth (split-screen) |
| `app/(auth)/login/` | Halaman login |
| `app/(auth)/register/` | Halaman registrasi |
| `types/next-auth.d.ts` | Type augmentation untuk session user |

## Alur Registrasi

```
User isi form (name, email, password, role)
        ↓
Validasi via Zod (registerSchema)
        ↓
Cek email duplikat di database
        ↓
Hash password dengan bcryptjs (salt: 10)
        ↓
Transaction: Create User + Create Profile (Client/Worker)
        ↓
Auto-login via signIn("credentials")
        ↓
Redirect ke /dashboard
```

### Validasi Register

```typescript
const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["CLIENT", "WORKER"], { error: "Role wajib dipilih" }),
});
```

## Alur Login

### Login Credentials
```
User isi email + password
        ↓
Validasi via Zod (loginSchema)
        ↓
signIn("credentials") → NextAuth authorize()
        ↓
Cari user di DB → bandingkan password (bcrypt.compare)
        ↓
Return user object {id, email, name, image, role}
        ↓
Generate JWT token (berisi role & id)
        ↓
Redirect ke /dashboard
```

### Login Google OAuth
```
User klik "Login with Google"
        ↓
loginWithGoogleAction() → signIn("google")
        ↓
Google OAuth flow
        ↓
PrismaAdapter auto-create/link account
        ↓
Redirect ke /dashboard
```

> **Catatan:** `allowDangerousEmailAccountLinking: true` diaktifkan agar akun Google bisa di-link dengan akun credentials yang sudah ada (by email).

## JWT Callbacks

Token JWT diperkaya dengan `role` dan `id` user:

```typescript
// auth.config.ts
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
}
```

## Strategi Session

- **Tipe:** JWT (bukan database session)
- **Adapter:** PrismaAdapter (untuk OAuth account linking saja)
- **Data di session:** `id`, `email`, `name`, `image`, `role`

## Error Handling

| Error | Pesan ke User |
|-------|---------------|
| Email sudah terdaftar | "Email sudah terdaftar." |
| CredentialsSignin | "Email atau password salah." |
| Error lainnya | "Terjadi kesalahan saat login." |
