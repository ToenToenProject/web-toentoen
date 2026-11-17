export const DIVISIONS = [ "Owner", "Bussiness Team", "IT Team", "Design Team", "QA"] as const;
export type Division = (typeof DIVISIONS)[number];

export type TeamMember = {
    id: string;
    name: string;
    division: Division;
    role: string;
    quoteHighlight: string;
    quoteRest: string;
    imageThumbnail: string;
    imageLarge: string;
    linkedinUrl?: string;
};

const portraitW = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&fit=crop";
const portraitM = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&fit=crop";
const portraitH = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&fit=crop";
const largeW = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&q=80&fit=crop";
const largeM = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&q=80&fit=crop";

export const TEAM_DATA: TeamMember[] = [
    // OWNER
    {
        id: "owner-1",
        name: "Ignatius Ricky Jonathan ",
        division: "Owner",
        role: "",
        quoteHighlight: 'Like a tree planted by flowing streams,',
        quoteRest:" it yields its fruit at the proper time, and its leaves never fall off..",
        imageThumbnail: "assets/Ko Ricky2.jpeg",
        imageLarge: "assets/Ko Ricky.jpeg",
        linkedinUrl: "  https://www.linkedin.com/in/igrickyjo/",
    },

    // FINANCE
    // {
    //     id: "finance-1",
    //     name: "Hansen Tegu",
    //     division: "Finance",
    //     role: "UX Researcher",
    //     quoteHighlight: '"Listen Closely"',
    //     quoteRest:": Setiap insight pengguna adalah peta menuju pengalaman yang lebih baik.",
    //     imageThumbnail: portraitM,
    //     imageLarge: largeM,
    //     linkedinUrl: "https://www.linkedin.com/in/hansenteguh/",
    // },

    // --- BUSSINESS TEAM ---
    // {
    //     id: "bus-1",
    //     name: "Erlinda Yunita Kesuma",
    //     division: "Bussiness Team",
    //     role: "Business Development",
    //     quoteHighlight: '"Growth Mindset"',
    //     quoteRest:": Membuka peluang baru dan memperluas ekosistem merchant lokal.",
    //     imageThumbnail: portraitM,
    //     imageLarge: largeM,
    //     linkedinUrl: " https://www.linkedin.com/in/erlinda-yunita-972a66a9/",
    // },
    {
        id: "bus-2",
        name: "Wahyuda Abdia Putra",
        division: "Bussiness Team",
        role: "Partnership Lead",
        quoteHighlight: '',
        quoteRest:"Kemitraan yang baik tumbuh dari nilai yang saling menguatkan.",
        imageThumbnail: "assets/IMG_22472.jpg",
        imageLarge: "assets/IMG_2247.jpg",
        linkedinUrl: " https://www.linkedin.com/in/wahyuda-abdia-putra-63b557407/",
    },
    {
        id: "bus-3",
        name: "Ferdy Gunardi Yohanes",
        division: "Bussiness Team",
        role: "Partnership Lead",
        quoteHighlight: '"Win Together"',
        quoteRest:": Kemitraan yang baik tumbuh dari nilai yang saling menguatkan.",
        imageThumbnail: "assets/ferdy.jpeg",
        imageLarge: "assets/ferdy.jpeg",
        linkedinUrl: "https://www.linkedin.com/in/ferdy-gunardi-08b0a571",
    },

    // --- IT TEAM ---
    {
        id: "it-1",
        name: "Wibowo Raditya Trilaksmono",
        division: "IT Team",
        role: "Tim IT",
        quoteHighlight: '"Kegagalan bukanlah akhir dari perjalanan,"',
        quoteRest:" melainkan bukti bahwa kamu sedang berproses dan mencoba sesuatu yang luar biasa.",
        imageThumbnail: "/assets/radit-copy.jpeg",
        imageLarge: "/assets/radit.jpeg",
        linkedinUrl: " https://www.linkedin.com/in/veldrict/",
    },
    {
        id: "it-2",
        name: "Rizqi Asan Masika",
        division: "IT Team",
        role: "Frontend Developer",
        quoteHighlight: '"Code is Poetry"',
        quoteRest: ": Membangun arsitektur clean code untuk masa depan Toentoen.",
        imageThumbnail: "/assets/asan foto.png",
        imageLarge: "/assets/ec7a28cf-c744-4ca3-940f-36bc9b9bfefc.png",
        linkedinUrl: "https://www.linkedin.com/in/rizqiasanmasika",
    },
    {
        id: "it-3",
        name: "Zulhan Arif Fasya Hidayat",
        division: "IT Team",
        role: "Backend Developer",
        quoteHighlight: '',
        quoteRest: "Sophisticated thoughts, questionable decisions.",
        imageThumbnail: "/assets/sul - Copy.jpeg",
        imageLarge: "/assets/sul.jpeg",
        linkedinUrl: " https://www.linkedin.com/in/zulhanariffasyahidayat/?locale=en "
    },
    {
        id: "it-4",
        name: "Rachmat Robby Pratama",
        division: "IT Team",
        role: "Frontend Developer",
        quoteHighlight: '"Beyond the Interface"',
        quoteRest:": Bukan sekadar membangun tampilan, tetapi menciptakan pengalaman pengguna yang berkesan",
        imageThumbnail: "/assets/robby2.png",
        imageLarge: "/assets/robby.png",
        linkedinUrl: " https://www.linkedin.com/in/rachmatrobbypratama/",
    },
    {
        id: "it-5",
        name: "Mohammad Havid Farell Adani",
        division: "IT Team",
        role: "Frontend Developer",
        quoteHighlight: '',
        quoteRest:"Consistency is boring until it works",
        imageThumbnail: "/assets/farel2.jpg",
        imageLarge: "/assets/farel.jpg",
        linkedinUrl: " https://www.linkedin.com/in/mohammad-havid-farell-adani/",
    },    

    // DESIGN TEAM
    {
        id: "Design-1",
        name: "Yanuar Rizki",
        division: "Design Team",
        role: "UX/UI Designer",
        quoteHighlight: '"Design is a Process"',
        quoteRest: ": Desain yang baik adalah hasil dari pemahaman yang mendalam tentang pengguna.",
        imageThumbnail: "/assets/yoga foto.png",
        imageLarge: "/assets/yoga foto besar.png",
        linkedinUrl: "https://www.linkedin.com/in/yanuar-rizki-94805b23b/"
    },
    {
        id: "Design-2",
        name: "Ramdani Firman Saputra",
        division: "Design Team",
        role: "UX/UI Designer",
        quoteHighlight: '"Design is a Process"',
        quoteRest: ": Desain yang baik adalah hasil dari pemahaman yang mendalam tentang pengguna.",
        imageThumbnail: "/assets/ramdani2.jpeg",
        imageLarge: "/assets/ramdani.jpeg",
        linkedinUrl: " https://www.linkedin.com/in/ramdani-firman-saputra-3649532b9/"
    },
    

    // QA
    {
        id: "QA-1",
        name: "Yoga Ari Kumoro",
        division: "QA",
        role: "Quality Assurance Engineer",
        quoteHighlight: '"Quality is a Process"',
        quoteRest: ": Memastikan setiap produk yang dirilis memenuhi standar kualitas tertinggi.",
        imageThumbnail: "/assets/yoga - Copy.jpeg",
        imageLarge: "/assets/yoga.jpeg",
        linkedinUrl: "https://www.linkedin.com/in/yoga-ari-kumoro/"
    },
];
