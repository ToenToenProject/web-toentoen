"use client";

import { MERCHANT_PRICING_TIERS } from '@/constants/product';
import { useEarlyAccess } from '@/context/EarlyAccessContext';

export const MerchantPricingSection = () => {
    const { openEarlyAccess } = useEarlyAccess();

    return (
        <section id="pricing" className="w-full bg-[#F9FAFB] py-20 lg:py-28 border-t border-gray-100">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs uppercase tracking-widest font-bold text-[#00c2a8] bg-[#e6f9f6] px-3.5 py-1.5 rounded-full inline-block mb-3">
                        Model Monetisasi Transparan
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                        Paket Langganan Merchant yang Adil
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                        Tumbuh bersama bisnis Anda. Mulai dari Rp 0 tanpa potongan komisi per transaksi, naikkan level toko sesuai skala kebutuhan.
                    </p>
                </div>

                {/* Grid Pricing Tiers */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 items-stretch">
                    {MERCHANT_PRICING_TIERS.map((tier) => (
                        <div
                            key={tier.name}
                            className={`flex flex-col justify-between rounded-3xl p-6 transition-all duration-200 ${
                                tier.highlight
                                    ? 'bg-[#083D39] text-white shadow-2xl ring-2 ring-[#00c2a8] transform lg:-translate-y-2'
                                    : 'bg-white text-gray-900 border border-gray-200 shadow-sm hover:shadow-md'
                            }`}
                        >
                            <div>
                                {tier.badge && (
                                    <span className="inline-block rounded-full bg-[#00c2a8] px-3 py-1 text-[11px] font-bold text-white mb-3">
                                        {tier.badge}
                                    </span>
                                )}
                                <h3 className={`text-xl font-bold ${tier.highlight ? 'text-white' : 'text-gray-900'}`}>
                                    {tier.name}
                                </h3>
                                <div className="mt-3 mb-2 flex items-baseline gap-1">
                                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                        {tier.price}
                                    </span>
                                    <span className={`text-xs ${tier.highlight ? 'text-teal-200' : 'text-gray-500'}`}>
                                        {tier.period}
                                    </span>
                                </div>
                                <p className={`text-xs mb-6 ${tier.highlight ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {tier.description}
                                </p>

                                <div className={`pt-4 border-t ${tier.highlight ? 'border-white/10' : 'border-gray-100'}`}>
                                    <p className={`text-[11px] font-bold uppercase tracking-wider mb-3 ${tier.highlight ? 'text-teal-300' : 'text-gray-400'}`}>
                                        Fitur Termasuk:
                                    </p>
                                    <ul className="space-y-2.5">
                                        {tier.features.map((feat, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-xs leading-tight">
                                                <svg
                                                    className={`h-4 w-4 shrink-0 mt-0.5 ${tier.highlight ? 'text-[#00c2a8]' : 'text-teal-600'}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2.5}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className={tier.highlight ? 'text-gray-200' : 'text-gray-600'}>
                                                    {feat}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    type="button"
                                    onClick={() => openEarlyAccess("merchant")}
                                    className={`block w-full py-2.5 px-4 text-center rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                                        tier.highlight
                                            ? 'bg-[#00c2a8] text-white hover:bg-[#00a892]'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                                >
                                    Pilih Paket {tier.name}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add-ons Information Strip */}
                <div className="mt-12 rounded-2xl bg-white p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="text-base font-bold text-gray-900 mb-1">
                            Pilihan Add-on Tambahan Visibilitas:
                        </h4>
                        <p className="text-sm text-gray-600">
                            <strong>Promotion Cards</strong> mulai Rp 25.000 / 7 hari &middot; <strong>Similar Ads</strong> mulai Rp 39.000 / 30 hari. Dapatkan diskon 10%–30% untuk merchant subscriber.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => openEarlyAccess("merchant")}
                        className="shrink-0 text-xs font-semibold text-[#00c2a8] bg-[#e6f9f6] px-4 py-2 rounded-full hover:bg-[#00c2a8] hover:text-white transition-colors cursor-pointer"
                    >
                        Konsultasi Paket Bisnis &rarr;
                    </button>
                </div>

            </div>
        </section>
    );
};
