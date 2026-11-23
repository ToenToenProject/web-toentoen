export const AboutHero = () => {
    return (
        <section className="relative flex h-[400px] w-full items-center justify-center overflow-hidden bg-gray-900 md:h-[450px]">
            {/* Background Image dengan Overlay Gelap */}
            <div className="absolute inset-0 z-0">
                <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80&fit=crop" 
                alt="Tim Toentoen" 
                className="h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-black/50 mix-blend-multiply" />
            </div>

            {/* Konten Teks */}
            <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
                <h1 className="mb-6 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
                Tentang Toentoen
                </h1>
                <p className="mx-auto max-w-3xl text-base text-gray-200 sm:text-lg leading-relaxed">
                Diambil dari ejaan lama kata <strong>&quot;Tuntun&quot;</strong>. Di tengah dominasi platform online yang menciptakan filter bubble dan membebani UMKM dengan potongan komisi tinggi, Toentoen hadir sebagai infrastruktur perdagangan lokal yang mengembalikan kendali ke tangan merchant dan memudahkan konsumen menemukan barang serta jasa nyata di sekitar mereka.
                </p>
            </div>
        </section>
    );
};
