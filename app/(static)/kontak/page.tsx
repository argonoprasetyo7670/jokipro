import type { Metadata } from "next";
import {
  IconMail,
  IconBrandWhatsapp,
  IconMapPin,
  IconClock,
  IconSend,
} from "@tabler/icons-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
            <span className="bg-gradient-to-r from-secondary via-primary to-blue-700 bg-clip-text text-transparent">
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
              <IconMail size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-1">Email</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Kirim email untuk pertanyaan umum atau laporan masalah.
            </p>
            <a
              href="mailto:edutasky.id@gmail.com"
              className="text-sm text-primary font-medium hover:underline"
            >
              edutasky.id@gmail.com
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
              href="https://wa.me/+628956228348750"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-500 font-medium hover:underline"
            >
              +628 9562 2834 8750
            </a>
          </div>

          <div className="group rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-amber-500/30 hover:bg-card transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
              <IconClock size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-1">Jam Operasional</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Tim support kami siap membantu Anda kapan saja.
            </p>
            <p className="text-sm text-foreground font-medium">
              Senin — Minggu, 24 Jam / 7 Hari
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
              Surabaya, Indonesia
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 sm:p-10">
          <h2 className="text-xl font-bold mb-6">Pertanyaan Umum (FAQ)</h2>
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Bagaimana Edutasky memastikan kualitas para Worker?",
                a: "Setiap Worker yang bergabung di Edutasky harus melewati tahapan seleksi yang sangat ketat. Proses ini meliputi verifikasi identitas terpusat (KYC), pengecekan rekam jejak akademik/profesional, peninjauan portofolio, hingga uji kompetensi pada bidang keahlian masing-masing. Kami hanya meloloskan talenta terbaik agar tugas Anda selalu ditangani oleh profesional yang terpercaya.",
              },
              {
                q: "Bagaimana proses evaluasi Worker dilakukan?",
                a: "Selain verifikasi dokumen awal, calon Worker harus mampu menyelesaikan studi kasus atau tes keahlian spesifik. Setelah bergabung, kami terus memantau performa dan kualitas kerja mereka secara berkala melalui sistem rating dan ulasan (review) dari para Client sebelumnya untuk memastikan standar tinggi tetap terjaga.",
              },
              {
                q: "Berapa biaya untuk menggunakan platform Edutasky?",
                a: "Pendaftaran di Edutasky sepenuhnya gratis, baik untuk Client maupun Worker. Anda bebas mencari Worker terbaik. Kami hanya mengenakan biaya platform sebesar 5% dari nilai transaksi yang berhasil.",
              },
              {
                q: "Apakah sistem pembayarannya aman?",
                a: "Sangat aman. Edutasky menggunakan sistem escrow (rekening bersama). Setelah Anda menyepakati harga dengan Worker, dana akan ditahan sementara oleh platform. Dana tersebut baru akan diteruskan ke Worker setelah Anda menerima dan menyetujui hasil pekerjaan secara penuh.",
              },
              {
                q: "Apa yang terjadi jika saya tidak puas dengan hasil kerja?",
                a: "Kepuasan Anda adalah prioritas utama kami. Anda berhak meminta revisi kepada Worker sesuai dengan ruang lingkup kesepakatan awal. Jika masih ada kendala, fitur dispute kami memungkinkan tim admin Edutasky bertindak sebagai penengah untuk memastikan Anda mendapatkan solusi terbaik dan paling adil.",
              },
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                <AccordionTrigger className="text-left font-semibold text-sm hover:no-underline hover:text-primary transition-colors py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
