"use client";

import { PLATFORM_POWER } from '@/constants/product';
import { useEarlyAccess } from '@/context/EarlyAccessContext';

// Komponen Checklist Centang Hijau
const CheckItem = ({ text }: { text: string }) => (
    <li className="flex items-start gap-3 text-sm text-gray-700">
        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00c2a8]">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <span className="font-medium leading-relaxed">{text}</span>
    </li>
);

export const ProductCTA = () => {
    const { openEarlyAccess } = useEarlyAccess();

    return (
        <>
        {/* Platform Power Section */}
        <section className="w-full bg-[#00c2a8] py-20 lg:py-24">
            <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <span className="text-xs uppercase tracking-widest font-bold text-teal-100 bg-[#0d4f47] px-3.5 py-1.5 rounded-full inline-block mb-3">
                    Keunggulan Ekosistem
                </span>
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    Satu Ekosistem, Dua Kekuatan Nyata
                </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Card User */}
                <div className="flex flex-col rounded-3xl bg-white p-8 sm:p-10 shadow-xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f9f6] text-teal-700">
                    <svg className="h-7 w-7 text-[#00c2a8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">Untuk Konsumen (Toeners)</h3>
                <p className="text-xs text-gray-500 mb-6">Pencarian offline pintar tanpa bias algoritma iklan</p>
                <ul className="flex flex-col gap-4 mb-8">
                    {PLATFORM_POWER.user.map((text, idx) => <CheckItem key={idx} text={text} />)}
                </ul>
                <button
                    type="button"
                    onClick={() => openEarlyAccess("user")}
                    className="mt-auto w-full py-3 rounded-full bg-[#00c2a8] text-white font-bold text-sm hover:bg-[#00a892] transition-colors cursor-pointer"
                >
                    Daftar Akses Awal Konsumen
                </button>
                </div>

                {/* Card Merchant */}
                <div className="flex flex-col rounded-3xl bg-white p-8 sm:p-10 shadow-xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f9f6] text-teal-700">
                    <svg className="h-7 w-7 text-[#00c2a8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">Untuk Pelaku Usaha (Merchants)</h3>
                <p className="text-xs text-gray-500 mb-6">Jemput bola pelanggan sekitar dan dominasi area hyperlocal</p>
                <ul className="flex flex-col gap-4 mb-8">
                    {PLATFORM_POWER.merchant.map((text, idx) => <CheckItem key={idx} text={text} />)}
                </ul>
                <button
                    type="button"
                    onClick={() => openEarlyAccess("merchant")}
                    className="mt-auto w-full py-3 rounded-full bg-[#083D39] text-white font-bold text-sm hover:bg-[#0d4f47] transition-colors cursor-pointer"
                >
                    Daftarkan Bisnis Anda (Mulai Rp 0)
                </button>
                </div>
            </div>
            </div>
        </section>

        {/* Bottom CTA Banner (Akses Awal & Daftarkan Bisnis) */}
        <section id="cta-early-access" className="w-full bg-white py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center rounded-3xl bg-[#083D39] px-6 py-16 text-center shadow-xl md:px-16 border border-[#0d4f47]">
                <span className="text-xs uppercase tracking-widest font-bold text-[#5fd9c4] bg-white/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
                    Tahap Pilot Proyek Jakarta &middot; Rilis Q4 2026
                </span>
                <h2 className="mb-4 max-w-3xl text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl leading-tight">
                    Jadilah yang Pertama Menggunakan Toentoen
                </h2>
                <p className="mb-10 max-w-2xl text-base text-gray-300 leading-relaxed">
                    Dapatkan akses eksklusif awal untuk mencari kebutuhan sekitarmu, atau daftarkan toko/jasa lokal Anda sekarang secara gratis untuk mendapatkan pendampingan onboarding langsung di Jakarta.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => openEarlyAccess("user")}
                        className="flex items-center gap-2 rounded-full bg-[#00c2a8] px-8 py-3.5 font-bold text-white transition hover:bg-[#00a892] shadow-lg shadow-[#00c2a8]/25 cursor-pointer"
                    >
                        <span>Daftar Akses Awal Konsumen</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => openEarlyAccess("merchant")}
                        className="flex items-center gap-2 rounded-full bg-white/15 px-8 py-3.5 font-bold text-white ring-1 ring-white/25 backdrop-blur-md transition hover:bg-white/25 cursor-pointer"
                    >
                        <span>Daftarkan Bisnis (Mulai Rp 0)</span>
                    </button>
                </div>
            </div>
            </div>
        </section>
        </>
    );
};
