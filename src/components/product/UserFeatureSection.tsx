import { USER_FEATURES, type ProductFeature } from '@/constants/product';

const getFeatureSvg = (key: ProductFeature['iconKey']) => {
    switch (key) {
        case 'map':
            return (
                <svg className="h-6 w-6 text-[#00c2a8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            );
        case 'signal':
            return (
                <svg className="h-6 w-6 text-[#00c2a8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
            );
        case 'filter':
            return (
                <svg className="h-6 w-6 text-[#00c2a8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
            );
        case 'shield':
        default:
            return (
                <svg className="h-6 w-6 text-[#00c2a8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            );
    }
};

export const UserFeatureSection = () => {
    return (
        <section className="relative w-full overflow-hidden bg-white">
        {/* Background Teal Setengah Layar Kanan (Hanya di Desktop) */}
        <div className="absolute bottom-0 right-0 top-0 hidden w-1/2 bg-[#00c2a8] lg:block"></div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24 py-20 lg:py-28">
            
            {/* Kiri: Teks & Fitur */}
            <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest font-bold text-[#00c2a8] bg-[#e6f9f6] px-3.5 py-1.5 rounded-full inline-block mb-3 w-fit">
                    Untuk Konsumen (User App)
                </span>
                <h3 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Temukan Apa Saja, Kapan Saja—Gratis Selamanya
                </h3>
                <p className="mb-10 text-gray-600 text-base leading-relaxed">
                    Kirim Sinyal Permintaan dan biarkan merchant terdekat memberikan penawaran terbaik. Eksplorasi bisnis offline tanpa batas dan tanpa bias algoritma iklan.
                </p>

                <div className="flex flex-col gap-6">
                {USER_FEATURES.map((feature, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e6f9f6]">
                        {getFeatureSvg(feature.iconKey)}
                    </div>
                    <div>
                        <h4 className="mb-1 text-lg font-bold text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                    </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Kanan: Gambar Mockup HP (Background Teal) */}
            <div className="flex justify-center rounded-3xl bg-[#00c2a8] p-8 lg:rounded-none lg:bg-transparent lg:p-0">
                <img 
                src="https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=600&q=80&fit=crop" 
                alt="Tampilan Antarmuka Aplikasi User Toentoen" 
                className="h-auto w-full max-w-md object-contain lg:max-w-full rounded-2xl shadow-2xl"
                />
            </div>

            </div>
        </div>
        </section>
    );
};
