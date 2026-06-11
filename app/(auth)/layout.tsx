import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.05)%22%2F%3E%3C%2Fsvg%3E')] bg-repeat" />
        <div className="relative max-w-md text-white">
          <Image src="/logo.png" alt="JokiPro Logo" width={56} height={56} className="w-14 h-14 rounded-2xl object-contain mb-8 bg-white/10 backdrop-blur-sm p-1" />
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            JokiPro
          </h1>
          <p className="text-violet-100 text-lg leading-relaxed mb-8">
            Platform marketplace terpercaya untuk jasa pengerjaan tugas.
            Cepat, aman, dan bergaransi.
          </p>
          <div className="space-y-4">
            {[
              "Sistem escrow yang aman",
              "Worker terverifikasi",
              "Garansi revisi",
              "Support 24/7",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-violet-100">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        {children}
      </div>
    </div>
  );
}
