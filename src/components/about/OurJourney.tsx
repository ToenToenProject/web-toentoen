import { JOURNEY_DATA } from '@/constants/about';

export const OurJourney = () => {
    return (
        <section className="w-full bg-white py-20 lg:py-28">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <div className="mb-12 max-w-2xl">
                    <span className="text-xs uppercase tracking-widest font-bold text-[#00c2a8] bg-[#e6f9f6] px-3.5 py-1.5 rounded-full inline-block mb-3">
                        Perjalanan & Roadmap Kami
                    </span>
                    <h2 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
                        Menuntun Perdagangan Hyperlocal Indonesia
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                        Langkah terencana dan terukur kami dari pilot percontohan di Jakarta hingga menghubungkan ekosistem bisnis offline di seluruh Pulau Jawa.
                    </p>
                </div>

                {/* Grid Journey Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {JOURNEY_DATA.map((item) => (
                        <div 
                        key={item.id} 
                        className="flex flex-col justify-between rounded-3xl bg-[#083D39] p-8 shadow-md border border-[#0d4f47]"
                        >
                            <div>
                                <span className="inline-block rounded-full bg-[#00c2a8] px-3 py-1 text-xs font-bold text-white mb-4">
                                    {item.year}
                                </span>
                                <h3 className="mb-3 text-2xl font-bold text-white leading-snug">{item.title}</h3>
                            </div>
                            <p className="text-sm leading-relaxed text-gray-300 mt-4 pt-4 border-t border-white/10">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};
