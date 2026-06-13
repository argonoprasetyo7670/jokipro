import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan — Edutasky",
  description:
    "Syarat dan Ketentuan penggunaan platform Edutasky. Pelajari hak dan kewajiban Anda sebagai pengguna layanan kami.",
};

export default function SyaratKetentuanPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Legal
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mt-3 tracking-tight">
            Syarat &amp; Ketentuan
          </h1>
          <p className="text-muted-foreground mt-4">
            Terakhir diperbarui: 1 Januari 2025
          </p>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 sm:p-10 space-y-10">

          <Section title="1. Penerimaan Syarat">
            <p>
              Dengan mengakses atau menggunakan platform Edutasky, Anda menyatakan bahwa
              Anda telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan
              Ketentuan ini. Jika Anda tidak setuju dengan syarat-syarat ini, mohon untuk
              tidak menggunakan platform kami.
            </p>
          </Section>

          <Section title="2. Definisi">
            <ul>
              <li><strong>&quot;Platform&quot;</strong> mengacu pada situs web Edutasky dan semua layanan terkait.</li>
              <li><strong>&quot;Client&quot;</strong> adalah pengguna yang memposting tugas dan mencari bantuan pengerjaan.</li>
              <li><strong>&quot;Worker&quot;</strong> adalah pengguna yang menawarkan jasa pengerjaan tugas.</li>
              <li><strong>&quot;Tugas&quot;</strong> adalah pekerjaan yang diposting oleh Client melalui platform.</li>
              <li><strong>&quot;Escrow&quot;</strong> adalah sistem penahanan dana yang dikelola oleh platform sebagai jaminan keamanan transaksi.</li>
            </ul>
          </Section>

          <Section title="3. Pendaftaran Akun">
            <p>
              Untuk menggunakan layanan kami, Anda harus membuat akun dengan memberikan
              informasi yang akurat dan lengkap. Anda bertanggung jawab untuk menjaga
              keamanan akun Anda, termasuk kata sandi.
            </p>
            <p>
              Anda harus berusia minimal 17 tahun atau telah mendapatkan persetujuan
              orang tua/wali untuk menggunakan platform ini.
            </p>
          </Section>

          <Section title="4. Kewajiban Client">
            <ul>
              <li>Memberikan deskripsi tugas yang jelas, lengkap, dan akurat.</li>
              <li>Menetapkan deadline dan budget yang realistis.</li>
              <li>Melakukan pembayaran sesuai kesepakatan melalui sistem escrow.</li>
              <li>Memberikan review yang jujur dan adil setelah tugas selesai.</li>
              <li>Tidak menggunakan platform untuk kegiatan yang melanggar hukum.</li>
            </ul>
          </Section>

          <Section title="5. Kewajiban Worker">
            <ul>
              <li>Melengkapi proses verifikasi identitas (KYC) sebelum dapat mengajukan penawaran.</li>
              <li>Menyelesaikan tugas sesuai dengan deskripsi, instruksi, dan deadline yang disepakati.</li>
              <li>Menyediakan hasil kerja yang orisinal dan berkualitas.</li>
              <li>Berkomunikasi secara profesional dengan client.</li>
              <li>Tidak melakukan plagiarisme atau menggunakan konten yang melanggar hak cipta.</li>
            </ul>
          </Section>

          <Section title="6. Sistem Pembayaran dan Escrow">
            <p>
              Semua transaksi di Edutasky diproses melalui sistem escrow untuk keamanan
              kedua belah pihak:
            </p>
            <ul>
              <li>Setelah client memilih worker, dana akan ditahan di sistem escrow.</li>
              <li>Dana baru akan dirilis ke worker setelah client menyetujui hasil pekerjaan.</li>
              <li>Platform memotong biaya layanan sebesar 5% dari nilai transaksi.</li>
              <li>Jika terjadi sengketa, admin platform akan menjadi mediator dan mengambil keputusan final.</li>
            </ul>
          </Section>

          <Section title="7. Penyelesaian Sengketa">
            <p>
              Jika terjadi ketidaksesuaian antara client dan worker, salah satu pihak
              dapat mengajukan sengketa (dispute) melalui platform. Tim admin Edutasky
              akan meninjau bukti-bukti yang diajukan dan mengambil keputusan yang adil.
            </p>
            <p>
              Keputusan admin bersifat final dan mengikat. Dana yang ditahan di escrow
              akan dialokasikan sesuai keputusan admin.
            </p>
          </Section>

          <Section title="8. Konten dan Hak Kekayaan Intelektual">
            <p>
              Semua konten yang dihasilkan melalui platform menjadi milik client setelah
              pembayaran selesai dirilis. Worker menjamin bahwa hasil kerjanya adalah
              orisinal dan tidak melanggar hak kekayaan intelektual pihak ketiga.
            </p>
            <p>
              Edutasky tidak bertanggung jawab atas pelanggaran hak cipta yang dilakukan
              oleh pengguna platform.
            </p>
          </Section>

          <Section title="9. Larangan">
            <p>Pengguna dilarang untuk:</p>
            <ul>
              <li>Melakukan transaksi di luar platform untuk menghindari biaya layanan.</li>
              <li>Membuat akun palsu atau menyamar sebagai orang lain.</li>
              <li>Mengirimkan konten yang bersifat ofensif, SARA, atau pornografi.</li>
              <li>Melakukan spam, phishing, atau aktivitas berbahaya lainnya.</li>
              <li>Memanipulasi sistem rating atau review.</li>
            </ul>
          </Section>

          <Section title="10. Pembatasan Tanggung Jawab">
            <p>
              Edutasky menyediakan platform &quot;sebagaimana adanya&quot; dan tidak memberikan
              jaminan atas kualitas pekerjaan yang dihasilkan oleh worker. Kami tidak
              bertanggung jawab atas:
            </p>
            <ul>
              <li>Kerugian langsung atau tidak langsung akibat penggunaan platform.</li>
              <li>Keterlambatan atau kegagalan penyelesaian tugas oleh worker.</li>
              <li>Kehilangan data atau gangguan layanan yang disebabkan oleh faktor di luar kendali kami.</li>
            </ul>
          </Section>

          <Section title="11. Penangguhan dan Pemutusan Akun">
            <p>
              Kami berhak menangguhkan atau menutup akun pengguna yang melanggar Syarat
              dan Ketentuan ini tanpa pemberitahuan terlebih dahulu. Dana yang tersisa
              di escrow akan diproses sesuai kebijakan yang berlaku.
            </p>
          </Section>

          <Section title="12. Perubahan Syarat">
            <p>
              Kami dapat mengubah Syarat dan Ketentuan ini sewaktu-waktu. Perubahan akan
              berlaku efektif segera setelah diposting di halaman ini. Penggunaan platform
              secara berkelanjutan setelah perubahan dianggap sebagai persetujuan Anda
              terhadap syarat yang diperbarui.
            </p>
          </Section>

          <Section title="13. Hukum yang Berlaku">
            <p>
              Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum
              Republik Indonesia. Setiap sengketa yang timbul dari penggunaan platform
              ini akan diselesaikan melalui musyawarah terlebih dahulu, dan jika tidak
              tercapai kesepakatan, akan diselesaikan melalui Pengadilan Negeri yang
              berwenang di Indonesia.
            </p>
          </Section>

          <Section title="14. Hubungi Kami">
            <p>
              Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan
              hubungi kami melalui:
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
