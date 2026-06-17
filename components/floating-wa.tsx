"use client";

import { IconBrandWhatsapp } from "@tabler/icons-react";

export function FloatingWA() {
  const waNumber = "62895622834875";
  const message = encodeURIComponent("Halo, saya ingin bertanya tentang layanan Edutasky.");
  const waUrl = `https://wa.me/${waNumber}?text=${message}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:bg-[#20bd5a] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label="Chat on WhatsApp"
    >
      <IconBrandWhatsapp size={32} />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white dark:border-gray-900"></span>
      </span>
    </a>
  );
}
