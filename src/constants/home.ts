export type FeatureIcon = "compass" | "signal" | "bolt" | "pin";

export type Feature = {
    id: number;
    icon: FeatureIcon;
    title: string;
    description: string;
};

export const FEATURES_DATA: Feature[] = [
    {
        id: 1,
        icon: "compass",
        title: "Unbiased Discovery",
        description:
        "Hasil pencarian ditampilkan berdasarkan relevansi, jarak terdekat, dan kepercayaan—bukan semata siapa yang membayar iklan terbesar.",
    },
    {
        id: 2,
        icon: "signal",
        title: "Sinyal Permintaan (Demand Signal)",
        description:
        "Posting kebutuhan mendesak beserta radius lokasi, lalu terima penawaran langsung dari merchant terdekat secara real-time.",
    },
    {
        id: 3,
        icon: "bolt",
        title: "Koneksi 2 Arah Instan",
        description:
        "Chat langsung dengan merchant untuk cek stok, jadwal, atau negosiasi—tanpa perantara kurir atau potongan komisi yang mencekik.",
    },
    {
        id: 4,
        icon: "pin",
        title: "Eksplorasi Peta Hyperlocal",
        description:
        "Jelajahi toko fisik, warung, pasar tradisional, dan penyedia jasa lokal yang sedang buka di sekitarmu dalam radius 1–50 km.",
    },
];

export type PlatformCard = {
    id: "user" | "merchant";
    tag: string;
    title: string;
    description: string;
    bullets: string[];
    image: string;
};

export const PLATFORM_CARDS: PlatformCard[] = [
    {
        id: "user",
        tag: "User",
        title: "Cari Barang & Jasa Nyata di Sekitarmu Jadi Lebih Mudah.",
        description:
        "Keluar dari filter bubble pencarian online. Temukan bisnis offline terpercaya, bandingkan penawaran dari Demand Signal, dan akses Promo Cards aktif di sekitarmu—gratis selamanya.",
        bullets: [
        "Pencarian Bersih Bebas Bias Iklan",
        "Sinyal Permintaan (Demand Signal) Real-time",
        "Akses Promo Cards Langsung dari Toko Sekitar",
        ],
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&fit=crop",
    },
    {
        id: "merchant",
        tag: "Merchant",
        title: "Kelola Bisnismu & Jemput Pelanggan Sekitar.",
        description:
        "Dapatkan visibilitas nyata tanpa perang iklan yang menggerus margin. Pantau Analitik Kinerja, Demand Heatmap, dan balas Sinyal Permintaan konsumen langsung dari aplikasi—mulai Rp 0/bulan.",
        bullets: [
        "Katalog Digital & Live Store yang Praktis",
        "Respon Cepat Sinyal Permintaan Konsumen",
        "Analitik Kinerja Toko & Demand Heatmap",
        ],
        image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80&fit=crop",
    },
];

export type Article = {
    id: number;
    category: string;
    title: string;
    excerpt: string;
    image: string;
};

export const NEWS_ARTICLES: Article[] = [
    {
        id: 1,
        category: "UPDATE",
        title: "Mengenal Demand Signal: Cara Baru Konsumen & Merchant Saling Menemukan",
        excerpt:
        "Bagaimana fitur Sinyal Permintaan membalik model pencarian tradisional dan membantu toko offline menjemput pembeli sekitar.",
        image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&q=80&fit=crop",
    },
    {
        id: 2,
        category: "TIPS UMKM",
        title: "Cara Meningkatkan Visibilitas Toko Offline Tanpa Perang Diskon",
        excerpt:
        "Panduan praktis pelaku usaha lokal membangun reputasi dan menjangkau pelanggan hyperlocal secara organik.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80&fit=crop",
    },
    {
        id: 3,
        category: "INSIGHT",
        title: "Potensi Rp 150 Triliun Pasar Tradisional Jakarta di Era Digital",
        excerpt:
        "Mengapa digitalisasi dua arah berbasis lokasi menjadi kunci kebangkitan pedagang pasar dan UMKM lokal ibu kota.",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80&fit=crop",
    },
];
