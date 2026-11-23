export type ProductFeature = {
    iconKey: 'map' | 'signal' | 'filter' | 'shield' | 'store' | 'chat' | 'chart' | 'users';
    title: string;
    desc: string;
};

export const USER_FEATURES: ProductFeature[] = [
    {
        iconKey: 'map',
        title: 'Peta Discovery Hyperlocal',
        desc: 'Pindai toko fisik, warung, dan penyedia jasa terdekat dalam radius 1–50 km dengan status Buka/Tutup real-time.',
    },
    {
        iconKey: 'signal',
        title: 'Search Signal (Demand Signal)',
        desc: 'Posting kebutuhan spesifik (misal: "Butuh tukang AC hari ini") dan bandingkan penawaran langsung dari merchant sekitar.',
    },
    {
        iconKey: 'filter',
        title: 'Filter Pintar & Unbiased Ranking',
        desc: 'Saring berdasarkan jarak, rating, kategori, dan jam buka tanpa jebakan manipulasi iklan berbayar.',
    },
    {
        iconKey: 'shield',
        title: 'Profil Lengkap & Promo Cards',
        desc: 'Akses katalog produk, ulasan pelanggan asli, kontak langsung (Chat/WhatsApp), dan promo aktif toko di sekitarmu.',
    },
];

export const MERCHANT_FEATURES: ProductFeature[] = [
    {
        iconKey: 'store',
        title: 'Katalog Digital & Live Store',
        desc: 'Unggah produk dan jasa, atur harga & promo diskon, bagikan postingan feed, hingga tayangan siaran live toko.',
    },
    {
        iconKey: 'signal',
        title: 'Respon Sinyal Real-Time',
        desc: 'Terima notifikasi instan saat konsumen di sekitarmu memposting permintaan yang cocok dan balas penawaran langsung via chat.',
    },
    {
        iconKey: 'chart',
        title: 'Analitik Bisnis & Demand Heatmap',
        desc: 'Pantau jumlah pengunjung profil, kata kunci populer, produk terfavorit, serta visualisasi peta permintaan area (radius 5–25 km).',
    },
    {
        iconKey: 'users',
        title: 'Manajemen Multi-Cabang & Admin',
        desc: 'Kelola beberapa cabang toko dan atur hak akses tim operasional/admin dalam satu dashboard terpusat (tersedia juga versi Lite untuk HP spesifikasi standar).',
    },
];

export const PLATFORM_POWER = {
    user: [
        'Temukan barang & jasa nyata terdekat tanpa jebakan filter bubble',
        'Kirim Sinyal Permintaan (Demand Signal) ke banyak toko sekaligus',
        'Eksplorasi peta interaktif dengan radius pencarian 1–50 km',
        'Gratis selamanya untuk pencarian, broadcast sinyal, dan chat',
    ],
    merchant: [
        'Katalog digital & siaran live store tanpa biaya komisi transaksi',
        'Jemput bola pelanggan aktif yang mengirim sinyal kebutuhan nyata',
        'Akses Demand Heatmap & analisis trafik pengunjung profil toko',
        'Tersedia versi Lite yang ringan untuk perangkat smartphone standar',
    ]
};

export type PricingTier = {
    name: string;
    price: string;
    period: string;
    badge?: string;
    description: string;
    features: string[];
    highlight?: boolean;
};

export const MERCHANT_PRICING_TIERS: PricingTier[] = [
    {
        name: 'Free',
        price: 'Rp 0',
        period: '/bulan',
        description: 'Untuk UMKM dan toko kecil yang baru memulai ekspansi digital.',
        features: [
            'Profil toko & katalog hingga 15 item',
            'Menerima Sinyal Permintaan radius 5 km',
            'Chat langsung 2 arah dengan konsumen',
            'Akses dashboard analitik dasar',
        ],
    },
    {
        name: 'Starter',
        price: 'Rp 29.000',
        period: '/bulan',
        description: 'Meningkatkan daya jangkau dan visibilitas toko di lingkungan sekitar.',
        features: [
            'Semua fitur Free',
            'Katalog hingga 50 item produk/jasa',
            'Jangkauan Sinyal Permintaan radius 15 km',
            '1 Promo Card aktif per minggu',
            'Akses analitik kata kunci pencarian',
        ],
    },
    {
        name: 'Growth',
        price: 'Rp 79.000',
        period: '/bulan',
        badge: 'Paling Populer',
        highlight: true,
        description: 'Solusi optimal untuk UMKM aktif yang ingin mendominasi area hyperlocal.',
        features: [
            'Semua fitur Starter',
            'Katalog produk/jasa tanpa batas',
            'Jangkauan Sinyal Permintaan radius 25 km',
            'Akses Demand Heatmap area sekitar',
            'Live Store broadcast & multi-admin (3 akun)',
            'Diskon 20% untuk add-on Promotion Cards',
        ],
    },
    {
        name: 'Pro',
        price: 'Rp 179.000',
        period: '/bulan',
        description: 'Didesain untuk bisnis multilocated atau toko beromzet tinggi.',
        features: [
            'Semua fitur Growth',
            'Jangkauan Sinyal maksimal hingga 50 km',
            'Manajemen hingga 3 cabang toko terpusat',
            'Multi-admin tak terbatas & laporan export',
            'Diskon 30% untuk add-on Similar Ads',
            'Prioritas support & verifikasi lencana resmi',
        ],
    },
    {
        name: 'Enterprise',
        price: 'Mulai Rp 480K',
        period: '/bulan',
        description: 'Solusi jaringan waralaba, pasar terintegrasi, atau asosiasi UMKM.',
        features: [
            'Semua fitur Pro',
            'Multi-cabang tanpa batas',
            'Integrasi API inventaris & CRM khusus',
            'Dedicated Account Manager & onboarding tim',
        ],
    },
];
