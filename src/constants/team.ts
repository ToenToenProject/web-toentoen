export const DIVISIONS = [
    "Leadership",
    "Business Team",
    "IT Team",
    "Design Team",
    "QA"
] as const;

export type Division = (typeof DIVISIONS)[number];

export type TeamMember = {
    id: string;
    name: string;
    division: Division;
    role: string;
    quoteHighlight: string;
    quoteRest: string;
    bio?: string;
    imageThumbnail: string;
    imageLarge: string;
    linkedinUrl?: string;
};

// All photos standardized to 600x750 (4:5 aspect ratio) in /assets/team/
export const FOUNDER_DATA: TeamMember = {
    id: "founder-1",
    name: "Ignatius Ricky Jonathan",
    division: "Leadership",
    role: "Founder & CEO",
    quoteHighlight: '"Like a tree planted by flowing streams,',
    quoteRest: ' it yields its fruit at the proper time, and its leaves never fall off..."',
    bio: "Berdedikasi membangun infrastruktur perdagangan lokal yang adil, terbuka, dan menghubungkan 65,5 juta UMKM Indonesia langsung dengan konsumen sekitar melalui teknologi hyperlocal dua arah.",
    imageThumbnail: "/assets/team/founder-ricky.jpg",
    imageLarge: "/assets/team/founder-ricky.jpg",
    linkedinUrl: "https://www.linkedin.com/in/igrickyjo/",
};

export const TEAM_MEMBERS: TeamMember[] = [
    // Business team
    {
        id: "bus-1",
        name: "Wahyuda Abdia Putra",
        division: "Business Team",
        role: "Partnership Lead",
        quoteHighlight: '"Win Together"',
        quoteRest: ": Kemitraan yang baik tumbuh dari nilai yang saling menguatkan.",
        bio: "Memimpin strategi kemitraan dan ekspansi ekosistem merchant offline di area percontohan DKI Jakarta.",
        imageThumbnail: "/assets/team/wahyuda.jpg",
        imageLarge: "/assets/team/wahyuda.jpg",
        linkedinUrl: "https://www.linkedin.com/in/wahyuda-abdia-putra-63b557407/",
    },
    {
        id: "bus-2",
        name: "Ferdy Gunardi Yohanes",
        division: "Business Team",
        role: "Partnership Lead",
        quoteHighlight: '"Win Together"',
        quoteRest: ": Kolaborasi lokal membuka peluang tanpa batas bagi pelaku usaha.",
        bio: "Mengembangkan relasi strategis dengan komunitas pedagang, pasar tradisional, dan asosiasi UMKM lokal.",
        imageThumbnail: "/assets/team/ferdy.jpg",
        imageLarge: "/assets/team/ferdy.jpg",
        linkedinUrl: "https://www.linkedin.com/in/ferdy-gunardi-08b0a571",
    },

    // Engineering team
    {
        id: "it-1",
        name: "Wibowo Raditya Trilaksmono",
        division: "IT Team",
        role: "Fullstack Developer",
        quoteHighlight: '"Kegagalan bukanlah akhir"',
        quoteRest: ", melainkan bukti bahwa kamu sedang berproses dan mencoba sesuatu yang luar biasa.",
        bio: "Mengembangkan arsitektur aplikasi end-to-end dengan fokus pada skalabilitas dan keamanan data pengguna.",
        imageThumbnail: "/assets/team/radit.jpg",
        imageLarge: "/assets/team/radit.jpg",
        linkedinUrl: "https://www.linkedin.com/in/veldrict/",
    },
    {
        id: "it-2",
        name: "Rizqi Asan Masika",
        division: "IT Team",
        role: "Frontend Developer",
        quoteHighlight: '"Code is Poetry"',
        quoteRest: ": Membangun arsitektur antarmuka yang bersih dan intuitif untuk Toentoen.",
        bio: "Bertanggung jawab atas performa, kebersihan kode, dan pengalaman navigasi web & mobile.",
        imageThumbnail: "/assets/team/asan.jpg",
        imageLarge: "/assets/team/asan.jpg",
        linkedinUrl: "https://www.linkedin.com/in/rizqiasanmasika",
    },
    {
        id: "it-3",
        name: "Zulhan Arif Fasya Hidayat",
        division: "IT Team",
        role: "Backend Developer",
        quoteHighlight: '"Scale with Care"',
        quoteRest: ": Menjamin stabilitas data dan performa tinggi untuk pencarian real-time.",
        bio: "Merancang API dan database performa tinggi untuk pemrosesan sinyal permintaan secara instan.",
        imageThumbnail: "/assets/team/zulhan.jpg",
        imageLarge: "/assets/team/zulhan.jpg",
        linkedinUrl: "https://www.linkedin.com/in/zulhanariffasyahidayat/",
    },
    {
        id: "it-4",
        name: "Rachmat Robby Pratama",
        division: "IT Team",
        role: "Frontend Developer",
        quoteHighlight: '"Beyond the Interface"',
        quoteRest: ": Menciptakan interaksi digital yang berkesan dan ramah untuk semua pengguna.",
        bio: "Mengimplementasikan desain UI modern ke dalam komponen antarmuka yang responsif dan interaktif.",
        imageThumbnail: "/assets/team/robby.jpg",
        imageLarge: "/assets/team/robby.jpg",
        linkedinUrl: "https://www.linkedin.com/in/rachmatrobbypratama/",
    },
    {
        id: "it-5",
        name: "Mohammad Havid Farell Adani",
        division: "IT Team",
        role: "Frontend Developer",
        quoteHighlight: '"Consistency"',
        quoteRest: " is boring until it works. Menghadirkan performa aplikasi yang andal.",
        bio: "Fokus pada optimasi kecepatan rendering antarmuka dan konsistensi komponen frontend.",
        imageThumbnail: "/assets/team/farel.jpg",
        imageLarge: "/assets/team/farel.jpg",
        linkedinUrl: "https://www.linkedin.com/in/mohammad-havid-farell-adani/",
    },

    // Design team
    {
        id: "des-1",
        name: "Yanuar Rizki",
        division: "Design Team",
        role: "UX/UI Designer",
        quoteHighlight: '"Design with Empathy"',
        quoteRest: ": Desain yang baik adalah hasil dari pemahaman mendalam tentang kebutuhan merchant.",
        bio: "Merancang alur pengalaman pengguna yang sederhana bagi konsumen dan pedagang dari berbagai kalangan.",
        imageThumbnail: "/assets/team/yanuar.jpg",
        imageLarge: "/assets/team/yanuar.jpg",
        linkedinUrl: "https://www.linkedin.com/in/yanuar-rizki-94805b23b/",
    },
    {
        id: "des-2",
        name: "Ramdani Firman Saputra",
        division: "Design Team",
        role: "UX/UI Designer",
        quoteHighlight: '"Simplicity First"',
        quoteRest: ": Menyederhanakan proses digitalisasi bisnis offline ke dalam genggaman.",
        bio: "Mengembangkan sistem desain visual yang konsisten, modern, dan mudah dipahami oleh merchant lokal.",
        imageThumbnail: "/assets/team/ramdani.jpg",
        imageLarge: "/assets/team/ramdani.jpg",
        linkedinUrl: "https://www.linkedin.com/in/ramdani-firman-saputra-3649532b9/",
    },

    // Quality assurance team
    {
        id: "qa-1",
        name: "Yoga Ari Kumoro",
        division: "QA",
        role: "Quality Assurance Engineer",
        quoteHighlight: '"Quality is Paramount"',
        quoteRest: ": Memastikan setiap fitur dan rilis aplikasi memenuhi standar kualitas tertinggi.",
        bio: "Melakukan pengujian fungsional dan pengujian beban sistem untuk menjamin keandalan platform Toentoen.",
        imageThumbnail: "/assets/team/yoga.jpg",
        imageLarge: "/assets/team/yoga.jpg",
        linkedinUrl: "https://www.linkedin.com/in/yoga-ari-kumoro/",
    },
];

// All team members including founder
export const TEAM_DATA: TeamMember[] = [FOUNDER_DATA, ...TEAM_MEMBERS];
