"use client";

import { useState, useMemo } from 'react';
import { NewsHero } from '@/components/news/NewsHero';
import { NewsCard } from '@/components/news/NewsCard';
import { NEWS_DATA } from '@/constants/news';

const CATEGORIES = ['Semua', 'UPDATE', 'TIPS UMKM', 'INSIGHT', 'COMMUNITY', 'EDUKASI'];

export default function NewsPage() {
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const filteredArticles = useMemo(() => {
        if (selectedCategory === 'Semua') return NEWS_DATA;
        return NEWS_DATA.filter((a) => a.type.toUpperCase() === selectedCategory.toUpperCase());
    }, [selectedCategory]);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
        }
    };

    return (
        <div className="flex w-full flex-col">
            <NewsHero />

            {/* Filter Pills */}
            <section className="w-full bg-white pt-10 pb-4 border-b border-gray-100">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => {
                                const isActive = selectedCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-[#00c2a8] text-white shadow-xs'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                            Menampilkan {filteredArticles.length} artikel
                        </span>
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="w-full bg-white py-12 lg:py-16">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {filteredArticles.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredArticles.map((article) => (
                                <NewsCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center text-gray-400">
                            Belum ada artikel dalam kategori ini.
                        </div>
                    )}
                </div>
            </section>

            {/* Email Waitlist Box (Pembaruan & Edukasi) */}
            <section className="w-full bg-[#F9FAFB] py-16 border-t border-gray-100">
                <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl bg-[#083D39] p-8 sm:p-12 text-center text-white shadow-xl border border-[#0d4f47]">
                        <span className="text-xs uppercase tracking-widest font-bold text-[#5fd9c4] bg-white/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
                            Newsletter & Update Rilis
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
                            Dapatkan Perkembangan Pilot Jakarta & Tips UMKM
                        </h3>
                        <p className="max-w-xl mx-auto text-sm text-gray-300 mb-8 leading-relaxed">
                            Jangan lewatkan informasi peluncuran aplikasi Toentoen, panduan strategi bisnis lokal, serta program pendampingan merchant gratis.
                        </p>

                        {!subscribed ? (
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Masukkan alamat email Anda"
                                    className="flex-1 rounded-full bg-white/10 border border-white/20 px-5 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00c2a8]"
                                />
                                <button
                                    type="submit"
                                    className="rounded-full bg-[#00c2a8] px-7 py-3 text-sm font-bold text-white hover:bg-[#00a892] transition-colors shadow-md cursor-pointer"
                                >
                                    Langganan
                                </button>
                            </form>
                        ) : (
                            <div className="rounded-2xl bg-white/10 p-4 border border-white/20 text-[#5fd9c4] font-medium text-sm">
                                ✓ Terima kasih! Email <strong>{email}</strong> telah berhasil didaftarkan ke buletin Toentoen.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
