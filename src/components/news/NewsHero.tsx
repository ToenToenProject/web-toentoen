export const NewsHero = () => {
    return (
        <section className="relative flex h-[350px] w-full items-center justify-center overflow-hidden bg-gray-900 md:h-[400px]">
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0">
            <img 
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80&fit=crop" 
            alt="Toentoen News Background" 
            className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
        </div>

        {/* Teks Konten */}
        <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
            <span className="text-xs uppercase tracking-widest font-bold text-[#00c2a8] bg-[#00c2a8]/20 px-3.5 py-1.5 rounded-full inline-block mb-3 text-[#5fd9c4]">
                Kabar & Pembaruan Resmi
            </span>
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Berita & Edukasi Hyperlocal
            </h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-gray-200 leading-relaxed">
            Transparansi roadmap, wawasan digitalisasi UMKM, dan pembaruan terkini seputar ekosistem perdagangan lokal Toentoen.
            </p>
        </div>
        </section>
    );
};
