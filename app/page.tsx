import Link from "next/link";
import Image from "next/image";
import {
  IconRocket,
  IconShieldCheck,
  IconCash,
  IconMessages,
  IconArrowRight,
  IconStarFilled,
  IconBriefcase,
  IconSchool,
  IconCode,
  IconChevronRight,
} from "@tabler/icons-react";
import { ThemeToggle } from "@/components/theme-toggle";

// ========== NAVBAR ==========
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl" />
      <div className="relative mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Edutasky Logo" width={32} height={32} className="w-8 h-8 rounded-lg object-contain" />
          <span className="text-lg font-bold tracking-tight">
            Edu<span className="text-primary">Tasky</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">
            Fitur
          </a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">
            Cara Kerja
          </a>
          <a href="#testimonials" className="hover:text-foreground transition-colors">
            Testimoni
          </a>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle size="sm" />
          <Link
            href="/login"
            className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-sm font-semibold rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
          >
            Daftar Gratis
            <IconArrowRight size={16} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ========== HERO ==========
function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300 text-xs font-medium mb-8 animate-slide-up">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Platform #1 di Indonesia
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Tugas Menumpuk?
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
            Serahkan ke Pro.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Marketplace terpercaya untuk jasa pengerjaan tugas sekolah, kuliah,
          dan pekerjaan. Sistem bidding transparan, escrow aman, dan
          hasil bergaransi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-base font-semibold rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105"
          >
            Mulai Sekarang — Gratis
            <IconArrowRight size={20} />
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center gap-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors px-6 py-4"
          >
            Lihat Cara Kerja
            <IconChevronRight size={18} />
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.4s" }}>
          {[
            { value: "10K+", label: "Tugas Selesai" },
            { value: "5K+", label: "Worker Aktif" },
            { value: "4.9", label: "Rating Rata-rata" },
            { value: "100%", label: "Escrow Aman" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl px-4 py-5 text-center">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== FEATURES ==========
function Features() {
  const features = [
    {
      icon: <IconRocket size={24} />,
      title: "Bidding Transparan",
      description:
        "Pasang budget, terima penawaran dari worker terbaik. Bandingkan harga, rating, dan portofolio sebelum memilih.",
      gradient: "from-violet-500 to-indigo-500",
    },
    {
      icon: <IconShieldCheck size={24} />,
      title: "Escrow Aman",
      description:
        "Dana ditahan di sistem sampai tugas selesai. Tidak ada penipuan, tidak ada risiko. Dijamin ToS yang jelas.",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: <IconCash size={24} />,
      title: "Harga Kompetitif",
      description:
        "Sistem bidding memungkinkan Anda mendapatkan harga terbaik dari worker profesional yang bersaing.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: <IconMessages size={24} />,
      title: "Chat Real-Time",
      description:
        "Komunikasi langsung dengan worker di dalam workspace. Tracking progres dan sharing file yang mudah.",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Fitur Unggulan
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 tracking-tight">
            Semua yang Anda Butuhkan
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Kami membangun platform yang aman, transparan, dan mudah digunakan
            untuk client maupun worker.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/30 hover:bg-card transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                {f.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== HOW IT WORKS ==========
function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Posting Tugas",
      description: "Client mengisi detail tugas, kategori, deadline, dan menetapkan budget.",
      icon: <IconBriefcase size={22} />,
    },
    {
      step: "02",
      title: "Terima Penawaran",
      description: "Worker profesional mengajukan bid. Client bandingkan dan pilih yang terbaik.",
      icon: <IconSchool size={22} />,
    },
    {
      step: "03",
      title: "Bayar via Escrow",
      description: "Dana diamankan di sistem. Worker mulai mengerjakan tugas dengan tenang.",
      icon: <IconShieldCheck size={22} />,
    },
    {
      step: "04",
      title: "Terima Hasil",
      description: "Review hasil, minta revisi jika perlu. Dana dirilis otomatis setelah disetujui.",
      icon: <IconCode size={22} />,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Cara Kerja
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 tracking-tight">
            Empat Langkah Mudah
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Dari posting tugas sampai terima hasil, prosesnya cepat dan
            transparan.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.step} className="relative group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-px bg-gradient-to-r from-border to-transparent" />
              )}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 flex items-center justify-center mb-5 group-hover:from-violet-500/20 group-hover:to-indigo-500/20 transition-all duration-300">
                  <span className="text-primary">{s.icon}</span>
                </div>
                <span className="text-xs font-bold text-primary/50 uppercase tracking-widest">
                  Step {s.step}
                </span>
                <h3 className="font-semibold text-lg mt-1 mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== CATEGORIES ==========
function Categories() {
  const categories = [
    { name: "Tugas Kuliah", count: "2.4K+", emoji: "📚" },
    { name: "Skripsi & Thesis", count: "890+", emoji: "🎓" },
    { name: "Programming", count: "1.2K+", emoji: "💻" },
    { name: "Desain Grafis", count: "650+", emoji: "🎨" },
    { name: "Data Entry", count: "430+", emoji: "📊" },
    { name: "Penulisan Artikel", count: "780+", emoji: "✍️" },
    { name: "Tugas Sekolah", count: "1.8K+", emoji: "📝" },
    { name: "Presentasi", count: "560+", emoji: "📽️" },
  ];

  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Kategori
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 tracking-tight">
            Semua Jenis Tugas
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div
              key={c.name}
              className="group rounded-2xl border border-border/50 bg-card/50 p-5 hover:border-primary/30 hover:bg-card transition-all duration-300 cursor-pointer"
            >
              <span className="text-3xl">{c.emoji}</span>
              <h3 className="font-semibold mt-3">{c.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {c.count} tugas selesai
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== TESTIMONIALS ==========
function Testimonials() {
  const testimonials = [
    {
      name: "Andi Pratama",
      role: "Mahasiswa Teknik Informatika",
      content:
        "Tugas pemrograman saya selesai dalam 2 hari! Worker-nya super profesional dan responsive. Hasil kerjanya rapi dan sesuai instruksi.",
      rating: 5,
    },
    {
      name: "Sari Dewi",
      role: "Karyawan Swasta",
      content:
        "Sangat membantu saat deadline menumpuk. Sistem escrow-nya bikin tenang, uang aman sampai tugas benar-benar selesai.",
      rating: 5,
    },
    {
      name: "Rizky Fadilah",
      role: "Worker Profesional",
      content:
        "Sebagai freelancer, platform ini luar biasa. Sistem pembayarannya transparan, client-nya jelas, dan selalu ada tugas baru setiap hari.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Testimoni
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 tracking-tight">
            Dipercaya Ribuan Pengguna
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <IconStarFilled key={i} size={16} className="text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                &ldquo;{t.content}&rdquo;
              </p>
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== CTA ==========
function CTA() {
  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.07)%22%2F%3E%3C%2Fsvg%3E')] bg-repeat" />

          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Siap Menyelesaikan Tugas?
            </h2>
            <p className="text-violet-100 max-w-lg mx-auto mb-8 text-lg">
              Bergabung sekarang dan temukan worker profesional untuk semua
              jenis tugas Anda. Gratis, tanpa biaya pendaftaran.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-base font-semibold rounded-full bg-white text-violet-700 px-8 py-4 hover:bg-violet-50 transition-all shadow-xl hover:scale-105"
              >
                Daftar Sebagai Client
                <IconArrowRight size={20} />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-base font-semibold rounded-full border-2 border-white/30 text-white px-8 py-4 hover:bg-white/10 transition-all"
              >
                Gabung Sebagai Worker
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ========== FOOTER ==========
function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Edutasky Logo" width={28} height={28} className="w-7 h-7 rounded-lg object-contain" />
            <span className="text-sm font-bold">
              Joki<span className="text-primary">Pro</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Edutasky. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ========== MAIN PAGE ==========
export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Categories />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
