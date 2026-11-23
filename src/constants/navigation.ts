export type NavLink = {
    label: string;
    href: string;
};

export const HEADER_LINKS: NavLink[] = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Product', href: '/product' },
    { label: 'Team', href: '/team' },
    { label: 'News', href: '/news' },
];

export type FooterSection = {
    title: string;
    links: NavLink[];
};

export const FOOTER_SECTIONS: FooterSection[] = [
    {
        title: 'PRODUK & LAYANAN',
        links: [
            { label: 'Unbiased Discovery', href: '/#platform-section' },
            { label: 'Sinyal Permintaan (Demand Signal)', href: '/product' },
            { label: 'Paket Harga Merchant', href: '/product#pricing' },
        ],
    },
    {
        title: 'PERUSAHAAN',
        links: [
            { label: 'Tentang Kami', href: '/about' },
            { label: 'Tim & Karir', href: '/team' },
            { label: 'Berita & Edukasi', href: '/news' },
        ],
    },
    {
        title: 'BANTUAN & LEGAL',
        links: [
            { label: 'Customer Service', href: '/customer-service' },
            { label: 'Kebijakan Privasi', href: '/privacy-policy' },
        ],
    },
];
