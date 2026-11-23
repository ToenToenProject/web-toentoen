export type NewsArticle = {
    id: string;
    type: string;
    title: string;
    desc: string;
    image: string;
    date: string;
    readTime: string;
    content: string[];
};

export const NEWS_DATA: NewsArticle[] = [
    // --- RECENT NEWS (4 Berita Utama) ---
    {
        id: 'news-1',
        type: 'UPDATE',
        title: 'Mengenal Demand Signal: Cara Baru Konsumen & Merchant Saling Menemukan',
        desc: 'Fitur Sinyal Permintaan membalik model pencarian tradisional. Konsumen memposting kebutuhan, merchant terdekat merespons penawaran secara instan.',
        image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&q=80&fit=crop',
        date: 'October 15, 2026',
        readTime: '4 mins read',
        content: [
            'Dalam model perdagangan online konvensional, toko offline dan UMKM sering kali tenggelam di balik biaya iklan yang mahal. Konsumen pun terjebak dalam algoritma berulang yang membatasi pilihan.',
            'Toentoen memperkenalkan konsep Demand Signal (Sinyal Permintaan), di mana pengguna cukup menyatakan apa yang mereka butuhkan beserta radius lokasi, lalu merchant terdekat yang memiliki stok atau layanan dapat langsung merespons dengan penawaran nyata.',
            'Solusi dua arah ini memastikan efisiensi waktu bagi pembeli dan mendatangkan calon pelanggan aktif bagi pemilik toko offline tanpa perlu perang diskon.'
        ],
    },
    {
        id: 'news-2',
        type: 'TIPS UMKM',
        title: 'Cara Meningkatkan Visibilitas Toko Offline Tanpa Perang Diskon & Biaya Admin Tinggi',
        desc: 'Strategi praktis bagi pelaku UMKM lokal untuk mengoptimalkan reputasi dan menjangkau pelanggan sekitar secara organik.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80&fit=crop',
        date: 'October 28, 2026',
        readTime: '5 mins read',
        content: [
            'Banyak pelaku bisnis lokal merasa terbebani oleh potongan komisi per transaksi yang mencapai belasan hingga puluhan persen di aplikasi pengiriman konvensional.',
            'Dengan memanfaatkan platform penemuan hyperlocal tanpa perantara transaksi, merchant dapat mempertahankan 100% margin keuntungan dan membangun relasi pelanggan jangka panjang melalui komunikasi langsung.',
            'Kuncinya adalah responsivitas cepat terhadap permintaan sekitar, kelengkapan informasi katalog, dan pemanfaatan ulasan pelanggan asli.'
        ],
    },
    {
        id: 'news-3',
        type: 'INSIGHT',
        title: 'Potensi Rp 150 Triliun Pasar Tradisional Jakarta di Era Digitalisasi Hyperlocal',
        desc: 'Mengapa digitalisasi dua arah berbasis lokasi menjadi kunci kebangkitan pedagang pasar dan UMKM lokal di ibu kota.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80&fit=crop',
        date: 'November 05, 2026',
        readTime: '6 mins read',
        content: [
            'Pasar tradisional dan toko lingkungan di DKI Jakarta menyimpan potensi perputaran ekonomi yang luar biasa besar, namun sering kali terkendala akses informasi ketersediaan barang secara real-time.',
            'Pendekatan hyperlocal Toentoen memetakan pelaku usaha offline ke dalam radius jangkauan 1–50 km, memungkinkan warga sekitar menemukan kebutuhan harian lebih cepat dari tetangga mereka sendiri.',
            'Inisiatif ini dirancang untuk memperkuat ekonomi sirkular lokal tanpa mengubah esensi transaksi ramah khas pasar tradisional.'
        ],
    },
    {
        id: 'news-4',
        type: 'COMMUNITY',
        title: 'Program Pendampingan Onboarding Gratis untuk UMKM Jakarta (Pilot Q4 2026)',
        desc: 'Tim Toentoen membuka registrasi pendampingan digitalisasi bagi pelaku usaha lokal di area percontohan Jakarta.',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80&fit=crop',
        date: 'November 18, 2026',
        readTime: '3 mins read',
        content: [
            'Menjelang peluncuran tahap pilot di kuartal empat 2026, Toentoen meluncurkan program pendampingan langsung bagi para pemilik toko fisik, warung, dan penyedia jasa lokal.',
            'Peserta program pilot akan mendapatkan bantuan pengaturan katalog digital gratis, optimasi profil toko, serta pelatihan penggunaan dashboard analitik dan respon sinyal.',
            'Pendaftaran dibuka bagi seluruh pelaku usaha yang berdomisili di DKI Jakarta.'
        ],
    },

    // --- ALL NEWS (Artikel Edukasi Tambahan) ---
    {
        id: 'news-5',
        type: 'EDUKASI',
        title: 'Memahami Konsep Unbiased Discovery: Pencarian yang Adil untuk Semua Skala Bisnis',
        desc: 'Bagaimana transparansi algoritma membantu toko kecil bersaing sehat dengan jaringan toko besar di lingkungan sekitar.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&fit=crop',
        date: 'November 20, 2026',
        readTime: '4 mins read',
        content: [
            'Monopoli visibilitas oleh penawar iklan tertinggi sering kali merugikan bisnis kecil yang sebenarnya memiliki produk berkualitas dan jarak lebih dekat ke konsumen.',
            'Toentoen menerapkan Unbiased Discovery yang memprioritaskan jarak nyata, relevansi kata kunci, dan kepuasan pembeli di atas peringkat sponsor.',
            'Hal ini menciptakan iklim persaingan yang sehat dan memberikan pilihan terbaik yang benar-benar ada di lingkungan konsumen.'
        ],
    },
    {
        id: 'news-6',
        type: 'PRODUK',
        title: 'Evolusi Tampilan Dashboard Merchant: Ringan dan Responsif untuk Perangkat Standar',
        desc: 'Merancang antarmuka bisnis yang intuitif, cepat, dan hemat kuota bagi seluruh pedagang offline.',
        image: 'https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=600&q=80&fit=crop',
        date: 'November 21, 2026',
        readTime: '3 mins read',
        content: [
            'Kami memahami bahwa efisiensi perangkat adalah hal krusial bagi operasional pedagang harian.',
            'Dashboard Toentoen hadir dengan optimasi performa tinggi, termasuk mode Lite yang memastikan seluruh fitur analitik, pengelolaan produk, dan respon chat berjalan mulus di ponsel spesifikasi standar.',
            'Semua data disajikan ringkas tanpa grafik yang membingungkan.'
        ],
    },
];
