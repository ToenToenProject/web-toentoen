"use client";

import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { PhoneMockups } from "@/components/home/hero/PhoneMockups";
import { useEarlyAccess } from "@/context/EarlyAccessContext";

export const HeroSection = () => {
    const { openEarlyAccess } = useEarlyAccess();

    return (
        <section className="relative min-h-[640px] w-full overflow-hidden bg-gray-900 lg:min-h-[720px]">
        {/* Background photo + dark gradient overlay */}
        <div className="absolute inset-0 z-0">
            <ImageWithFallback
            src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80&fit=crop"
            alt="Toentoen Local Discovery"
            fallback="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80&fit=crop"
            className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Teks */}
            <div className="flex flex-col lg:col-span-7">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#00c2a8]/20 px-3.5 py-1.5 text-xs font-semibold text-[#5fd9c4] backdrop-blur-xs ring-1 ring-[#00c2a8]/30 w-fit">
                    <span>🚀 Platform Perdagangan Hyperlocal Dua Arah</span>
                </div>
                <h1 className="mb-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[52px]">
                Temukan Apapun di Sekitarmu—
                <br />
                <span className="text-[#00c2a8]">Barang & Jasa Lokal</span>
                <br />
                dalam Satu Genggaman
                </h1>
                <p className="mb-10 max-w-xl text-sm leading-relaxed text-gray-200/90 sm:text-base">
                Platform pencarian perdagangan lokal dua arah yang menuntun konsumen ke bisnis offline terdekat (radius 1–50 km) dan menuntun merchant menemukan permintaan nyata—tanpa bias monopoli iklan.
                </p>

                {/* Primary CTAs */}
                <div className="flex flex-wrap gap-4 items-center">
                <button
                    type="button"
                    onClick={() => openEarlyAccess("user")}
                    className="inline-flex items-center justify-center rounded-full bg-[#00c2a8] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#00a892] shadow-lg shadow-[#00c2a8]/25 cursor-pointer"
                >
                    Daftar Akses Awal Konsumen
                </button>
                <button
                    type="button"
                    onClick={() => openEarlyAccess("merchant")}
                    className="inline-flex items-center justify-center rounded-full bg-white/10 px-7 py-3.5 text-sm font-bold text-white ring-1 ring-white/20 backdrop-blur-md transition hover:bg-white/20 cursor-pointer"
                >
                    Daftarkan Bisnis (Gratis)
                </button>
                </div>
                <p className="mt-3 text-xs text-gray-400">
                    Fokus pilot percontohan: DKI Jakarta (Rilis Q4 2026)
                </p>
            </div>

            {/* Mockup HP */}
            <div className="flex justify-center lg:col-span-5 lg:justify-end">
                <PhoneMockups />
            </div>
            </div>
        </div>
        </section>
    );
};
