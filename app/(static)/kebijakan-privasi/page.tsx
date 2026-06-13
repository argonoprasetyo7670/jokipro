import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — Edutasky",
  description:
    "Kebijakan Privasi Edutasky menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda saat menggunakan platform kami.",
};

export default function KebijakanPrivasiPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Legal
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mt-3 tracking-tight">
            Kebijakan Privasi
          </h1>
          <p className="text-muted-foreground mt-4">
            Terakhir diperbarui: 1 Januari 2025
          </p>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 sm:p-10 space-y-10">

          <Section title="1. Pendahuluan">
            <p>
              Edutasky (&quot;kami&quot;, &quot;kita&quot;, atau &quot;milik kami&quot;) berkomitmen untuk melindungi
              privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan,
              menggunakan, mengungkapkan, dan melindungi informasi pribadi Anda saat Anda
              menggunakan platform Edutasky (situs web dan layanan terkait).
            </p>
            <p>
              Dengan menggunakan platform kami, Anda menyetujui pengumpulan dan penggunaan
              informasi sesuai dengan kebijakan ini.
            </p>
          </Section>

          <Section title="2. Informasi yang Kami Kumpulkan">
            <p>Kami mengumpulkan beberapa jenis informasi untuk menyediakan dan meningkatkan layanan kami:</p>
            <ul>
              <li><strong>Informasi Akun:</strong> Nama lengkap, alamat email, kata sandi (terenkripsi), nomor telepon, dan foto profil.</li>
              <li><strong>Informasi Profil Worker:</strong> Data pendidikan (universitas, jurusan, jenjang), CV, portofolio, dan dokumen verifikasi KYC.</li>
              <li><strong>Informasi Transaksi:</strong> Riwayat pesanan, pembayaran, jumlah transaksi, dan status pembayaran.</li>
              <li><strong>Informasi Teknis:</strong> Alamat IP, jenis browser, perangkat yang digunakan, halaman yang dikunjungi, dan waktu akses.</li>
              <li><strong>Komunikasi:</strong> Pesan yang dikirim melalui fitur chat dalam platform antara client dan worker.</li>
            </ul>
          </Section>

          <Section title="3. Penggunaan Informasi">
            <p>Informasi yang kami kumpulkan digunakan untuk:</p>
            <ul>
              <li>Menyediakan, mengoperasikan, dan memelihara platform Edutasky.</li>
              <li>Memproses pendaftaran akun dan verifikasi identitas (KYC).</li>
              <li>Memfasilitasi transaksi antara client dan worker, termasuk sistem escrow.</li>
              <li>Mengirimkan notifikasi terkait layanan, pesanan, dan pembaruan platform.</li>
              <li>Meningkatkan pengalaman pengguna dan mengembangkan fitur baru.</li>
              <li>Mencegah penipuan, penyalahgunaan, dan aktivitas ilegal lainnya.</li>
              <li>Mematuhi kewajiban hukum yang berlaku.</li>
            </ul>
          </Section>

          <Section title="4. Penyimpanan dan Keamanan Data">
            <p>
              Kami menyimpan data Anda pada server yang aman dengan enkripsi standar industri.
              Kata sandi pengguna dienkripsi menggunakan algoritma bcrypt dan tidak pernah
              disimpan dalam bentuk teks biasa.
            </p>
            <p>
              Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang wajar untuk
              melindungi data Anda dari akses tidak sah, pengubahan, pengungkapan, atau
              penghancuran yang tidak sah.
            </p>
          </Section>

          <Section title="5. Pembagian Informasi">
            <p>Kami tidak menjual data pribadi Anda kepada pihak ketiga. Kami dapat membagikan informasi Anda dalam situasi berikut:</p>
            <ul>
              <li><strong>Dengan pengguna lain:</strong> Informasi profil yang relevan dibagikan antara client dan worker dalam konteks transaksi.</li>
              <li><strong>Dengan penyedia layanan:</strong> Pihak ketiga yang membantu kami mengoperasikan platform (hosting, pembayaran, analitik).</li>
              <li><strong>Untuk kepatuhan hukum:</strong> Jika diwajibkan oleh hukum, peraturan, atau proses hukum yang berlaku.</li>
              <li><strong>Untuk perlindungan:</strong> Untuk melindungi hak, properti, atau keselamatan Edutasky, pengguna kami, atau pihak lain.</li>
            </ul>
          </Section>

          <Section title="6. Cookie dan Teknologi Pelacakan">
            <p>
              Kami menggunakan cookie dan teknologi serupa untuk mengumpulkan informasi tentang
              aktivitas browsing Anda. Cookie digunakan untuk:
            </p>
            <ul>
              <li>Menjaga sesi login Anda tetap aktif.</li>
              <li>Mengingat preferensi dan pengaturan Anda.</li>
              <li>Menganalisis penggunaan platform untuk peningkatan layanan.</li>
            </ul>
            <p>
              Anda dapat mengatur browser Anda untuk menolak cookie, namun beberapa fitur
              platform mungkin tidak berfungsi dengan baik.
            </p>
          </Section>

          <Section title="7. Hak Anda">
            <p>Anda memiliki hak untuk:</p>
            <ul>
              <li>Mengakses dan memperbarui informasi pribadi Anda melalui halaman profil.</li>
              <li>Meminta penghapusan akun dan data pribadi Anda.</li>
              <li>Menolak pengiriman email pemasaran dari kami.</li>
              <li>Meminta salinan data pribadi yang kami simpan tentang Anda.</li>
            </ul>
            <p>
              Untuk mengajukan permintaan terkait hak-hak ini, silakan hubungi kami melalui
              halaman <a href="/kontak" className="text-primary hover:underline">Hubungi Kami</a>.
            </p>
          </Section>

          <Section title="8. Perubahan Kebijakan">
            <p>
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan
              akan diposting di halaman ini dengan tanggal &quot;Terakhir diperbarui&quot; yang
              direvisi. Kami menyarankan Anda untuk meninjau halaman ini secara berkala.
            </p>
          </Section>

          <Section title="9. Hubungi Kami">
            <p>
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi
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
