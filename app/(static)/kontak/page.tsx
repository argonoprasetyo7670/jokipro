import type { Metadata } from "next";
import {
  IconMail,
  IconBrandWhatsapp,
  IconMapPin,
  IconClock,
  IconSend,
} from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Hubungi Kami — Edutasky",
  description:
    "Hubungi tim Edutasky untuk pertanyaan, saran, atau bantuan. Kami siap membantu Anda melalui email, WhatsApp, atau formulir kontak.",
};

export default function KontakPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Hubungi Kami
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mt-3 tracking-tight">
            Ada Pertanyaan?{" "}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Kami Siap Membantu
            </span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-lg">
            Tim support kami siap menjawab pertanyaan dan memberikan bantuan.
            Hubungi kami melalui kanal di bawah ini.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="group rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/30 hover:bg-card transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
              <IconMail size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-1">Email</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Kirim email untuk pertanyaan umum atau laporan masalah.
            </p>
            <a
              href="mailto:support@edutasky.id"
              className="text-sm text-primary font-medium hover:underline"
            >
              support@edutasky.id
            </a>
          </div>

          <div className="group rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-emerald-500/30 hover:bg-card transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
              <IconBrandWhatsapp size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-1">WhatsApp</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Chat langsung dengan tim support untuk respon cepat.
            </p>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-500 font-medium hover:underline"
            >
              +62 812-3456-7890
            </a>
          </div>

          <div className="group rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-amber-500/30 hover:bg-card transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
              <IconClock size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-1">Jam Operasional</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Tim support kami tersedia di jam kerja.
            </p>
            <p className="text-sm text-foreground font-medium">
              Senin — Jumat, 09:00 — 18:00 WIB
            </p>
          </div>

          <div className="group rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-blue-500/30 hover:bg-card transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
              <IconMapPin size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-1">Lokasi</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Kantor pusat kami berlokasi di:
            </p>
            <p className="text-sm text-foreground font-medium">
              Jakarta, Indonesia
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 sm:p-10">
          <h2 className="text-xl font-bold mb-6">Pertanyaan Umum (FAQ)</h2>
          <div className="space-y-6">
            {[
              {
                q: "Berapa biaya untuk mendaftar di Edutasky?",
                a: "Pendaftaran di Edutasky sepenuhnya gratis, baik untuk Client maupun Worker. Kami hanya mengenakan biaya platform sebesar 5% dari nilai transaksi yang berhasil.",
              },
              {
                q: "Bagaimana sistem pembayaran bekerja?",
                a: "Edutasky menggunakan sistem escrow. Setelah Client memilih Worker, dana akan ditahan oleh platform. Dana baru dirilis ke Worker setelah Client menyetujui hasil pekerjaan.",
              },
              {
                q: "Apa yang terjadi jika saya tidak puas dengan hasil kerja?",
                a: "Anda dapat meminta revisi kepada Worker. Jika tetap tidak puas, Anda dapat mengajukan dispute melalui platform dan tim admin kami akan menjadi mediator.",
              },
              {
                q: "Bagaimana proses verifikasi Worker?",
                a: "Worker harus melalui proses KYC (Know Your Customer) dengan mengunggah CV, portofolio, dan data pendidikan. Tim admin akan memverifikasi sebelum Worker dapat mengajukan penawaran.",
              },
              {
                q: "Berapa lama waktu respon dari tim support?",
                a: "Kami berusaha merespon semua pertanyaan dalam waktu 1x24 jam pada hari kerja. Untuk masalah urgent, silakan hubungi kami melalui WhatsApp.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="pb-6 border-b border-border/50 last:border-0 last:pb-0"
              >
                <h3 className="font-semibold text-sm text-foreground mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
