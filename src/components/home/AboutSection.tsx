import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

export const AboutSection = () => {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Peta */}
          <div className="flex justify-center">
            <ImageWithFallback
              src="/images/indonesia-map.png"
              fallback="/images/indonesia-map.png"
              alt="Peta Indonesia Toentoen Hyperlocal"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Teks */}
          <div className="flex flex-col items-start">
            <span className="text-xs uppercase tracking-widest font-bold text-[#00c2a8] bg-[#e6f9f6] px-3.5 py-1.5 rounded-full inline-block mb-3">
              Tentang Kami
            </span>
            <h2 className="mb-5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-[42px] leading-tight">
              Menuntun Konsumen & Bisnis Lokal Saling Menemukan
            </h2>
            <p className="mb-7 max-w-lg text-sm leading-relaxed text-gray-600 sm:text-base">
              Diambil dari ejaan lama kata <strong>&quot;Tuntun&quot;</strong>, Toentoen membangun ekosistem pasar lokal yang adil dan terbuka—menghubungkan toko offline, UMKM, dan penyedia jasa sekitar langsung dengan konsumen melalui pencarian aktif dan pasif tanpa bias monopoli iklan.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center rounded-full border-2 border-[#00c2a8] px-6 py-2.5 text-sm font-bold text-[#00c2a8] transition-colors hover:bg-[#00c2a8] hover:text-white"
            >
              Pelajari Kisah & Roadmap Kami
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
