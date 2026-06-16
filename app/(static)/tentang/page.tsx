import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  IconUsers,
  IconTarget,
  IconShieldCheck,
  IconRocket,
  IconHeart,
  IconBulb,
} from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Tentang Kami — Edutasky",
  description:
    "Kenali lebih dekat Edutasky, platform marketplace terpercaya untuk jasa pengerjaan tugas sekolah, kuliah, dan pekerjaan di Indonesia.",
};

export default function TentangPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Tentang Kami
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mt-3 tracking-tight">
            Misi Kami untuk{" "}
            <span className="bg-gradient-to-r from-secondary via-primary to-blue-700 bg-clip-text text-transparent">
              Membantu Indonesia
            </span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
            Edutasky adalah platform marketplace digital yang menghubungkan
            individu yang membutuhkan bantuan pengerjaan tugas dengan para
            profesional terverifikasi di seluruh Indonesia.
          </p>
        </div>

        {/* Story */}
        <div className="prose prose-invert max-w-none mb-16">
          <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 sm:p-10 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <IconBulb size={22} className="text-amber-400" />
              Cerita Kami
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Edutasky lahir dari keresahan yang dialami banyak mahasiswa dan
              pekerja di Indonesia: tugas yang menumpuk, deadline yang ketat,
              dan keterbatasan waktu. Kami percaya bahwa setiap orang berhak
              mendapatkan bantuan berkualitas dengan harga yang transparan dan
              adil.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Didirikan pada tahun 2024, Edutasky telah membantu ribuan
              pengguna menyelesaikan berbagai jenis tugas — dari tugas kuliah,
              skripsi, programming, desain grafis, hingga presentasi bisnis.
              Kami terus berkembang dengan komitmen untuk menjadi platform
              marketplace tugas nomor satu di Indonesia.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-10">
            Nilai-Nilai Kami
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <IconShieldCheck size={24} />,
                title: "Kepercayaan & Keamanan",
                description:
                  "Sistem escrow yang aman memastikan dana Anda terlindungi. Pembayaran hanya dirilis setelah tugas selesai dan disetujui.",
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                icon: <IconTarget size={24} />,
                title: "Transparansi",
                description:
                  "Sistem bidding terbuka, rating publik, dan portofolio terverifikasi. Anda selalu tahu dengan siapa Anda bekerja.",
                gradient: "from-primary to-secondary",
              },
              {
                icon: <IconHeart size={24} />,
                title: "Kualitas",
                description:
                  "Setiap worker melalui proses verifikasi KYC. Kami menjaga standar kualitas tinggi melalui sistem review dan rating.",
                gradient: "from-pink-500 to-rose-500",
              },
              {
                icon: <IconUsers size={24} />,
                title: "Komunitas",
                description:
                  "Kami membangun komunitas profesional yang saling membantu. Lebih dari 5.000 worker aktif siap membantu Anda.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: <IconRocket size={24} />,
                title: "Inovasi",
                description:
                  "Kami terus berinovasi dengan teknologi terbaru termasuk AI untuk matching tugas dan optimasi pengalaman pengguna.",
                gradient: "from-amber-500 to-orange-500",
              },
              {
                icon: <IconBulb size={24} />,
                title: "Aksesibilitas",
                description:
                  "Platform yang mudah digunakan untuk semua kalangan. Gratis pendaftaran, tanpa biaya berlangganan.",
                gradient: "from-secondary to-primary",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="group rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/30 hover:bg-card transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {value.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-brand-gradient" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.07)%22%2F%3E%3C%2Fsvg%3E')] bg-repeat" />
          <div className="relative px-8 py-12 sm:px-16 sm:py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
              Bergabung Bersama Kami
            </h2>
            <p className="text-blue-100 max-w-md mx-auto mb-6">
              Mulai sekarang, gratis tanpa biaya pendaftaran.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-base font-semibold rounded-full bg-white text-primary px-8 py-3.5 hover:bg-blue-50 transition-all shadow-xl hover:scale-105"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
