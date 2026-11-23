"use client";

import { useEarlyAccess } from '@/context/EarlyAccessContext';

export const ProductHero = () => {
    const { openEarlyAccess } = useEarlyAccess();

    return (
        <section className="relative flex min-h-[500px] w-full items-center overflow-hidden bg-gray-900 py-20 lg:py-28">
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0">
            <img 
            src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=1920&q=80&fit=crop" 
            alt="Solusi Digital Perdagangan Hyperlocal Toentoen" 
            className="h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
                <span className="text-xs uppercase tracking-widest font-bold text-[#00c2a8] bg-[#00c2a8]/20 px-3.5 py-1.5 rounded-full inline-block mb-4 text-[#5fd9c4] ring-1 ring-[#00c2a8]/30">
                    Satu Ekosistem, Dua Kekuatan
                </span>
                <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                    Cari Lokal Lebih Cepat, Kembangkan Usaha Lebih Adil
                </h1>
                <p className="mb-10 text-base sm:text-lg text-gray-200 leading-relaxed">
                    Toentoen menjembatani konsumen dan merchant offline terdekat secara dua arah. Broadcast kebutuhanmu melalui Demand Signal, temukan toko terpercaya di sekitarmu, dan jalin transaksi langsung tanpa biaya potongan perantara.
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                    <a href="#pricing" className="flex items-center gap-2 rounded-full bg-[#00c2a8] px-8 py-3.5 font-bold text-white transition hover:bg-[#00a892] shadow-lg shadow-[#00c2a8]/25">
                        <span>Lihat Paket Merchant (Mulai Rp 0)</span>
                    </a>
                    <button 
                        type="button"
                        onClick={() => openEarlyAccess("user")} 
                        className="flex items-center gap-2 rounded-full bg-white/20 px-8 py-3.5 font-bold text-white backdrop-blur-md transition hover:bg-white/30 cursor-pointer"
                    >
                        <span>Daftar Akses Awal Konsumen</span>
                    </button>
                </div>
            </div>
        </div>
        </section>
    );
};
