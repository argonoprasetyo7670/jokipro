import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { IconArrowRight } from "@tabler/icons-react";

function StaticNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl" />
      <div className="relative mx-auto max-w-7xl px-6 h-24 sm:h-28 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Edutasky Logo" width={300} height={200} className="w-auto h-16 sm:h-20 md:h-24 object-contain drop-shadow-md" />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link href="/tentang" className="hover:text-foreground transition-colors">
            Tentang
          </Link>
          <Link href="/kebijakan-privasi" className="hover:text-foreground transition-colors">
            Privasi
          </Link>
          <Link href="/syarat-ketentuan" className="hover:text-foreground transition-colors">
            Syarat
          </Link>
          <Link href="/kontak" className="hover:text-foreground transition-colors">
            Kontak
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle size="sm" />
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-sm font-semibold rounded-full bg-brand-gradient text-white px-5 py-2.5 hover:opacity-90 transition-all shadow-lg shadow-primary/25"
          >
            Daftar Gratis
            <IconArrowRight size={16} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function StaticFooter() {
  return (
    <footer className="border-t border-border/50 py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/logo.png" alt="Edutasky Logo" width={300} height={200} className="w-auto h-16 sm:h-20 md:h-24 object-contain drop-shadow-md" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Platform marketplace terpercaya untuk jasa pengerjaan tugas. Cepat, aman, dan bergaransi.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">Fitur</Link></li>
              <li><Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">Cara Kerja</Link></li>
              <li><Link href="/#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimoni</Link></li>
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Perusahaan</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tentang" className="text-muted-foreground hover:text-foreground transition-colors">Tentang Kami</Link></li>
              <li><Link href="/kontak" className="text-muted-foreground hover:text-foreground transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/kebijakan-privasi" className="text-muted-foreground hover:text-foreground transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/syarat-ketentuan" className="text-muted-foreground hover:text-foreground transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="/disclaimer" className="text-muted-foreground hover:text-foreground transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Edutasky. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/kebijakan-privasi" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/syarat-ketentuan" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/kontak" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function StaticPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StaticNavbar />
      <main className="flex-1 pt-24 sm:pt-28">
        {children}
      </main>
      <StaticFooter />
    </>
  );
}
