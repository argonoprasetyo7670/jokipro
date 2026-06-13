import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer — Edutasky",
  description:
    "Disclaimer Edutasky — Informasi penting mengenai batasan tanggung jawab platform kami dalam penyediaan layanan marketplace tugas.",
};

export default function DisclaimerPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Legal
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mt-3 tracking-tight">
            Disclaimer
          </h1>
          <p className="text-muted-foreground mt-4">
            Terakhir diperbarui: 1 Januari 2025
          </p>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 sm:p-10 space-y-10">

          <Section title="1. Informasi Umum">
            <p>
              Edutasky adalah platform marketplace yang menghubungkan individu yang
              membutuhkan bantuan pengerjaan tugas (Client) dengan penyedia jasa (Worker).
              Kami bertindak sebagai perantara dan fasilitator, bukan sebagai penyedia
              jasa langsung.
            </p>
          </Section>

          <Section title="2. Peran Platform">
            <p>
              Edutasky tidak mempekerjakan worker dan tidak memberikan jaminan atas kualitas,
              akurasi, kelengkapan, atau ketepatan waktu pekerjaan yang dihasilkan oleh worker.
              Semua transaksi dan kesepakatan kerja terjadi langsung antara client dan worker.
            </p>
            <p>
              Platform kami menyediakan sistem escrow untuk keamanan transaksi dan fitur
              dispute resolution untuk menyelesaikan sengketa, namun tidak bertanggung
              jawab atas kerugian yang timbul dari transaksi antar pengguna.
            </p>
          </Section>

          <Section title="3. Penggunaan Hasil Kerja">
            <p>
              Hasil pekerjaan yang diperoleh melalui platform Edutasky ditujukan sebagai
              referensi dan bahan pembelajaran. Pengguna bertanggung jawab penuh atas
              bagaimana mereka menggunakan hasil kerja tersebut.
            </p>
            <p>
              Edutasky tidak bertanggung jawab atas penyalahgunaan hasil kerja, termasuk
              namun tidak terbatas pada penggunaan yang melanggar kebijakan akademik
              institusi pendidikan atau peraturan perundang-undangan yang berlaku.
            </p>
          </Section>

          <Section title="4. Konten Pihak Ketiga">
            <p>
              Platform kami mungkin mengandung tautan atau referensi ke situs web atau
              layanan pihak ketiga. Kami tidak mengendalikan dan tidak bertanggung jawab
              atas konten, kebijakan privasi, atau praktik situs web pihak ketiga tersebut.
            </p>
          </Section>

          <Section title="5. Ketersediaan Layanan">
            <p>
              Kami berusaha untuk menjaga platform tetap tersedia 24/7, namun tidak
              menjamin ketersediaan layanan tanpa gangguan. Kami dapat melakukan pemeliharaan,
              perbaikan, atau pembaruan yang dapat menyebabkan layanan tidak tersedia
              sementara.
            </p>
          </Section>

          <Section title="6. Akurasi Informasi">
            <p>
              Informasi yang ditampilkan di platform (termasuk profil pengguna, rating,
              dan review) disediakan oleh pengguna dan mungkin tidak selalu akurat atau
              terkini. Kami tidak menjamin kebenaran informasi yang diberikan oleh pengguna.
            </p>
          </Section>

          <Section title="7. Risiko Finansial">
            <p>
              Meskipun kami menggunakan sistem escrow untuk melindungi transaksi, pengguna
              tetap menanggung risiko finansial yang terkait dengan penggunaan platform.
              Kami menyarankan pengguna untuk selalu berhati-hati dan melakukan due diligence
              sebelum melakukan transaksi.
            </p>
          </Section>

          <Section title="8. Perubahan Platform">
            <p>
              Kami berhak mengubah, memodifikasi, atau menghentikan fitur platform kapan
              saja tanpa pemberitahuan terlebih dahulu. Kami tidak bertanggung jawab atas
              kerugian yang timbul akibat perubahan tersebut.
            </p>
          </Section>

          <Section title="9. Hubungi Kami">
            <p>
              Jika Anda memiliki pertanyaan tentang Disclaimer ini, silakan hubungi
              kami melalui:
            </p>
            <ul>
              <li>Email: <span className="text-primary">support@edutasky.id</span></li>
              <li>Halaman: <a href="/kontak" className="text-primary hover:underline">Hubungi Kami</a></li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:text-foreground">
        {children}
      </div>
    </div>
  );
}
