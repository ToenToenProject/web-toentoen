import { VISION_MISSION, CORE_VALUES } from '@/constants/about';

export const VisionMission = () => {
    return (
        <section className="w-full bg-[#00c2a8] py-20 lg:py-28 text-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-16">
                <span className="text-xs uppercase tracking-widest font-bold text-teal-100 bg-[#0d4f47] px-3.5 py-1.5 rounded-full inline-block mb-3">
                    Fondasi & Nilai Kami
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
                    Visi, Misi & Nilai Inti
                </h2>
            </div>

            {/* Grid Visi & Misi */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-14">
                {/* Card Visi */}
                <div className="flex flex-col rounded-3xl bg-white p-8 sm:p-10 shadow-xl text-gray-900">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f9f6]">
                        <svg className="h-7 w-7 text-[#00c2a8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                    <h3 className="mb-4 text-2xl sm:text-3xl font-extrabold text-gray-900">{VISION_MISSION.vision.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-base">{VISION_MISSION.vision.desc}</p>
                </div>

                {/* Card Misi */}
                <div className="flex flex-col rounded-3xl bg-white p-8 sm:p-10 shadow-xl text-gray-900">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f9f6]">
                        <svg className="h-7 w-7 text-[#00c2a8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="mb-4 text-2xl sm:text-3xl font-extrabold text-gray-900">{VISION_MISSION.mission.title}</h3>
                    <ul className="space-y-3 text-gray-600 text-sm sm:text-base">
                        {VISION_MISSION.mission.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#00c2a8] text-[10px] font-bold text-white">
                                    {idx + 1}
                                </span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 3 Core Values (Nilai Inti) */}
            <div className="rounded-3xl bg-[#083D39] p-8 sm:p-12 shadow-xl">
                <h3 className="text-center text-2xl sm:text-3xl font-extrabold text-white mb-8">
                    3 Nilai Inti (Core Values)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {CORE_VALUES.map((val) => (
                        <div key={val.title} className="rounded-2xl bg-white/10 p-6 border border-white/15 backdrop-blur-sm">
                            <h4 className="text-lg font-bold text-[#5fd9c4] mb-2">{val.title}</h4>
                            <p className="text-sm text-gray-200 leading-relaxed">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
        </section>
    );
};
