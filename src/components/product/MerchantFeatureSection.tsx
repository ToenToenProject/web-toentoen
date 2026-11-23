import { MERCHANT_FEATURES, type ProductFeature } from '@/constants/product';

const getMerchantSvg = (key: ProductFeature['iconKey']) => {
    switch (key) {
        case 'store':
            return (
                <svg className="h-6 w-6 text-[#00c2a8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            );
        case 'signal':
            return (
                <svg className="h-6 w-6 text-[#00c2a8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            );
        case 'chart':
            return (
                <svg className="h-6 w-6 text-[#00c2a8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            );
        case 'users':
        default:
            return (
                <svg className="h-6 w-6 text-[#00c2a8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            );
    }
};

export const MerchantFeatureSection = () => {
    return (
        <section className="relative w-full overflow-hidden bg-white">
        {/* Background Teal Setengah Layar Kiri (Hanya di Desktop) */}
        <div className="absolute bottom-0 left-0 top-0 hidden w-1/2 bg-[#00c2a8] lg:block"></div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24 py-20 lg:py-28">
            
            {/* Kiri: Gambar Mockup HP (Background Teal) */}
            <div className="order-2 flex justify-center rounded-3xl bg-[#00c2a8] p-8 lg:order-1 lg:rounded-none lg:bg-transparent lg:p-0">
                <img 
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80&fit=crop" 
                alt="Tampilan Antarmuka Aplikasi Merchant Toentoen" 
                className="h-auto w-full max-w-md object-contain lg:max-w-full rounded-2xl shadow-2xl"
                />
            </div>

            {/* Kanan: Teks & Fitur */}
            <div className="order-1 flex flex-col lg:order-2">
                <span className="text-xs uppercase tracking-widest font-bold text-[#00c2a8] bg-[#e6f9f6] px-3.5 py-1.5 rounded-full inline-block mb-3 w-fit">
                    Untuk Pelaku Usaha (Merchant App)
                </span>
                <h3 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Kelola Bisnis & Jemput Permintaan Pelanggan
                </h3>
                <p className="mb-10 text-gray-600 text-base leading-relaxed">
                    Jangan hanya menunggu konsumen datang. Pantau sinyal kebutuhan di sekitarmu, balas langsung dengan penawaran kompetitif, dan kelola katalog serta staf tokomu dengan mudah.
                </p>

                <div className="flex flex-col gap-6">
                {MERCHANT_FEATURES.map((feature, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e6f9f6]">
                        {getMerchantSvg(feature.iconKey)}
                    </div>
                    <div>
                        <h4 className="mb-1 text-lg font-bold text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                    </div>
                    </div>
                ))}
                </div>
            </div>

            </div>
        </div>
        </section>
    );
};
