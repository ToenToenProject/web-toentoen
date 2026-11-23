export interface CmoProfile {
  name: string;
  role: string;
  avatar: string;
}

export const INITIAL_CMO_PROFILE: CmoProfile = {
  name: 'Silvi',
  role: 'CMO',
  avatar: '/assets/avatars/starter-photo-profile.jpg',
};

// Admin Operations Dataset
export interface TicketMetrics {
  activeTickets: {
    total: number;
    open: number;
    pending: number;
    unassigned: number;
  };
  responseTime: string;
  responseTimeTrend: string;
  avgResolutionTime: string;
  resolutionTimeTrend: string;
  csatScore: string;
  csatScoreDetail: string;
  slaCompliance: string;
  slaBreaches: string;
}

export interface DivisionMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  metrics: TicketMetrics;
}

export interface DivisionData {
  id: string;
  name: string;
  supervisor: DivisionMember;
  members: DivisionMember[];
}

const DEFAULT_METRICS: TicketMetrics = {
  activeTickets: {
    total: 500,
    open: 200,
    pending: 100,
    unassigned: 200,
  },
  responseTime: '8m 12s',
  responseTimeTrend: '↗ 12% faster than yesterday',
  avgResolutionTime: '1h 12s',
  resolutionTimeTrend: '↗ 6% faster than yesterday',
  csatScore: '90%',
  csatScoreDetail: '+2 pts from 500 responses',
  slaCompliance: '80%',
  slaBreaches: '19 breaches in current period',
};

export const CMO_DIVISIONS_DATA: DivisionData[] = [
  {
    id: 'div-a',
    name: 'Division A',
    supervisor: {
      id: 'sup-1',
      name: 'Dewi Lestari (Admin Supervisor)',
      role: 'Supervisor',
      avatar: '/assets/avatars/starter-photo-profile.jpg',
      metrics: {
        activeTickets: {
          total: 9,
          open: 1,
          pending: 2,
          unassigned: 6,
        },
        responseTime: '0m 45s',
        responseTimeTrend: '↗ 12% faster than yesterday',
        avgResolutionTime: '7h 42m',
        resolutionTimeTrend: '↗ 6% faster than yesterday',
        csatScore: '100%',
        csatScoreDetail: '+2 pts from 1 responses',
        slaCompliance: '91%',
        slaBreaches: '1 breaches in current period',
      },
    },
    members: [
      {
        id: 'mem-1',
        name: 'Citra Amelia (Admin)',
        role: 'Admin',
        avatar: '/assets/avatars/starter-photo-profile.jpg',
        metrics: {
          activeTickets: {
            total: 4,
            open: 2,
            pending: 1,
            unassigned: 1,
          },
          responseTime: '0m 45s',
          responseTimeTrend: '↗ 12% faster than yesterday',
          avgResolutionTime: '7h 42m',
          resolutionTimeTrend: '↗ 6% faster than yesterday',
          csatScore: '100%',
          csatScoreDetail: '+2 pts from 1 responses',
          slaCompliance: '91%',
          slaBreaches: '0 breaches in current period',
        },
      },
      {
        id: 'mem-2',
        name: 'Staff Admin',
        role: 'Admin',
        avatar: '/assets/avatars/starter-photo-profile.jpg',
        metrics: {
          activeTickets: {
            total: 4,
            open: 2,
            pending: 1,
            unassigned: 1,
          },
          responseTime: '0m 45s',
          responseTimeTrend: '↗ 12% faster than yesterday',
          avgResolutionTime: '7h 42m',
          resolutionTimeTrend: '↗ 6% faster than yesterday',
          csatScore: '100%',
          csatScoreDetail: '+2 pts from 1 responses',
          slaCompliance: '91%',
          slaBreaches: '0 breaches in current period',
        },
      },
    ],
  },
  {
    id: 'div-b',
    name: 'Division B',
    supervisor: {
      id: 'sup-2',
      name: 'Farel Dimas',
      role: 'Supervisor',
      avatar: '/assets/avatars/starter-photo-profile.jpg',
      metrics: {
        activeTickets: {
          total: 9,
          open: 1,
          pending: 2,
          unassigned: 6,
        },
        responseTime: '0m 45s',
        responseTimeTrend: '↗ 12% faster than yesterday',
        avgResolutionTime: '7h 42m',
        resolutionTimeTrend: '↗ 6% faster than yesterday',
        csatScore: '100%',
        csatScoreDetail: '+2 pts from 1 responses',
        slaCompliance: '91%',
        slaBreaches: '1 breaches in current period',
      },
    },
    members: [],
  },
  {
    id: 'div-c',
    name: 'Division C',
    supervisor: {
      id: 'sup-3',
      name: 'Rian Pratama',
      role: 'Supervisor',
      avatar: '/assets/avatars/starter-photo-profile.jpg',
      metrics: {
        activeTickets: {
          total: 9,
          open: 1,
          pending: 2,
          unassigned: 6,
        },
        responseTime: '0m 45s',
        responseTimeTrend: '↗ 12% faster than yesterday',
        avgResolutionTime: '7h 42m',
        resolutionTimeTrend: '↗ 6% faster than yesterday',
        csatScore: '100%',
        csatScoreDetail: '+2 pts from 1 responses',
        slaCompliance: '91%',
        slaBreaches: '1 breaches in current period',
      },
    },
    members: [],
  },
];

// Social Media Operations Dataset
export interface SocialMetric {
  title: string;
  value: string;
  subText: string;
  subColor: string;
}

export const CMO_SOCIAL_METRICS: SocialMetric[] = [
  {
    title: 'TOTAL ENGAGEMENT',
    value: '48,292',
    subText: '↗ 12% vs last week',
    subColor: 'text-emerald-600',
  },
  {
    title: 'SCHEDULED POSTS',
    value: '18',
    subText: 'Across 5 channels',
    subColor: 'text-gray-400',
  },
  {
    title: 'OPEN INBOX',
    value: '27',
    subText: '8 need attention',
    subColor: 'text-rose-500',
  },
  {
    title: 'CHANNEL HEALTH',
    value: '96%',
    subText: 'All systems connected',
    subColor: 'text-gray-400',
  },
];

export interface CalendarPostItem {
  channel: 'IG' | 'FB' | 'TikTok' | 'LinkedIn';
  title: string;
  time: string;
  status: 'Scheduled' | 'Published' | 'Draft';
}

export interface CalendarDay {
  dayName: string;
  dateNumber: number;
  isToday?: boolean;
  posts: CalendarPostItem[];
}

export const CMO_WEEKLY_CALENDAR: CalendarDay[] = [
  {
    dayName: 'Mon',
    dateNumber: 14,
    posts: [
      { channel: 'IG', title: 'Valentine Poster', time: '11.30', status: 'Scheduled' },
    ],
  },
  {
    dayName: 'Tue',
    dateNumber: 15,
    isToday: true,
    posts: [
      { channel: 'IG', title: 'Valentine Poster', time: '11.30', status: 'Published' },
      { channel: 'FB', title: 'Valentine Poster', time: '12.30', status: 'Published' },
    ],
  },
  {
    dayName: 'Wed',
    dateNumber: 16,
    posts: [
      { channel: 'IG', title: 'Valentine Poster', time: '11.30', status: 'Scheduled' },
    ],
  },
  {
    dayName: 'Thu',
    dateNumber: 17,
    posts: [
      { channel: 'IG', title: 'Valentine Poster', time: '11.30', status: 'Scheduled' },
    ],
  },
  {
    dayName: 'Fri',
    dateNumber: 18,
    posts: [
      { channel: 'IG', title: 'Valentine Poster', time: '11.30', status: 'Scheduled' },
    ],
  },
  {
    dayName: 'Sat',
    dateNumber: 19,
    posts: [
      { channel: 'IG', title: 'Valentine Poster', time: '11.30', status: 'Scheduled' },
    ],
  },
  {
    dayName: 'Sun',
    dateNumber: 20,
    posts: [
      { channel: 'IG', title: 'Valentine Poster', time: '11.30', status: 'Scheduled' },
    ],
  },
];

export interface SocialTeamMember {
  id: string;
  name: string;
  avatar: string;
  status: 'Online' | 'Offline';
}

export const CMO_SOCIAL_TEAM_MEMBERS: SocialTeamMember[] = [
  { id: '1', name: 'Dewi Lestari', avatar: '/assets/avatars/starter-photo-profile.jpg', status: 'Online' },
  { id: '2', name: 'Citra Amelia', avatar: '/assets/avatars/starter-photo-profile.jpg', status: 'Online' },
  { id: '3', name: 'Farel Dimas', avatar: '/assets/avatars/starter-photo-profile.jpg', status: 'Online' },
  { id: '4', name: 'Rian Pratama', avatar: '/assets/avatars/starter-photo-profile.jpg', status: 'Offline' },
  { id: '5', name: 'Nadia Safitri', avatar: '/assets/avatars/starter-photo-profile.jpg', status: 'Offline' },
  { id: '6', name: 'Kevin Sanjaya', avatar: '/assets/avatars/starter-photo-profile.jpg', status: 'Offline' },
];

export interface ChannelConnection {
  channel: 'Instagram' | 'Facebook' | 'Linkedin' | 'Tiktok' | 'Whatsapp';
  handle: string;
  connected: boolean;
}

export interface DivisionChannelRow {
  id: string;
  member: {
    name: string;
    role: string;
    avatar: string;
  };
  channels: ChannelConnection[];
}

export const CMO_DIVISION_CHANNELS: DivisionChannelRow[] = [
  {
    id: 'sup-a',
    member: {
      name: 'Dewi Lestari',
      role: 'Supervisor',
      avatar: '/assets/avatars/starter-photo-profile.jpg',
    },
    channels: [
      { channel: 'Instagram', handle: '@Toentoen', connected: true },
      { channel: 'Facebook', handle: '@Toentoen', connected: true },
      { channel: 'Linkedin', handle: '@Toentoen', connected: true },
      { channel: 'Tiktok', handle: '@Toentoen', connected: false },
      { channel: 'Whatsapp', handle: '@Toentoen', connected: false },
    ],
  },
  {
    id: 'mem-a1',
    member: {
      name: 'Citra Amelia',
      role: 'Admin',
      avatar: '/assets/avatars/starter-photo-profile.jpg',
    },
    channels: [
      { channel: 'Instagram', handle: '@Toentoen', connected: true },
      { channel: 'Facebook', handle: '@Toentoen', connected: true },
      { channel: 'Linkedin', handle: '@Toentoen', connected: true },
      { channel: 'Tiktok', handle: '@Toentoen', connected: false },
      { channel: 'Whatsapp', handle: '@Toentoen', connected: false },
    ],
  },
  {
    id: 'mem-a2',
    member: {
      name: 'Farel Dimas',
      role: 'Content Creator',
      avatar: '/assets/avatars/starter-photo-profile.jpg',
    },
    channels: [
      { channel: 'Instagram', handle: '@Toentoen', connected: true },
      { channel: 'Facebook', handle: '@Toentoen', connected: true },
      { channel: 'Linkedin', handle: '@Toentoen', connected: true },
      { channel: 'Tiktok', handle: '@Toentoen', connected: false },
      { channel: 'Whatsapp', handle: '@Toentoen', connected: false },
    ],
  },
  {
    id: 'mem-a3',
    member: {
      name: 'Nadia Safitri',
      role: 'Specialist',
      avatar: '/assets/avatars/starter-photo-profile.jpg',
    },
    channels: [
      { channel: 'Instagram', handle: '@Toentoen', connected: true },
      { channel: 'Facebook', handle: '@Toentoen', connected: true },
      { channel: 'Linkedin', handle: '@Toentoen', connected: true },
      { channel: 'Tiktok', handle: '@Toentoen', connected: false },
      { channel: 'Whatsapp', handle: '@Toentoen', connected: false },
    ],
  },
  {
    id: 'mem-a4',
    member: {
      name: 'Kevin Sanjaya',
      role: 'Specialist',
      avatar: '/assets/avatars/starter-photo-profile.jpg',
    },
    channels: [
      { channel: 'Instagram', handle: '@Toentoen', connected: true },
      { channel: 'Facebook', handle: '@Toentoen', connected: true },
      { channel: 'Linkedin', handle: '@Toentoen', connected: true },
      { channel: 'Tiktok', handle: '@Toentoen', connected: false },
      { channel: 'Whatsapp', handle: '@Toentoen', connected: false },
    ],
  },
];

// Post Management Dataset
export interface CmoPostCard {
  id: string;
  channel: 'Tiktok' | 'Facebook' | 'Instagram' | 'Linkedin';
  image: string;
  accountName: string;
  caption: string;
  likes: number;
  comments: number;
  views: number;
  reposts: number;
  bookmarks: number;
}

export const CMO_POST_CARDS: CmoPostCard[] = [
  {
    id: 'post-1',
    channel: 'Tiktok',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80&fit=crop',
    accountName: 'Toentoen',
    caption: 'Nikmati sajian spesial lokal terbaik di sekitar Anda. Temukan diskon menarik hanya di aplikasi Toentoen!',
    likes: 20,
    comments: 20,
    views: 20,
    reposts: 20,
    bookmarks: 20,
  },
  {
    id: 'post-2',
    channel: 'Tiktok',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&q=80&fit=crop',
    accountName: 'Toentoen',
    caption: 'Kelezatan kuliner khas nusantara siap diantarkan langsung ke depan pintu Anda hari ini.',
    likes: 24,
    comments: 18,
    views: 35,
    reposts: 12,
    bookmarks: 28,
  },
  {
    id: 'post-3',
    channel: 'Instagram',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80&fit=crop',
    accountName: 'Toentoen',
    caption: 'Dukung UMKM favoritmu dengan berbelanja produk lokal pilihan melalui fitur Sinyal Permintaan.',
    likes: 45,
    comments: 32,
    views: 90,
    reposts: 15,
    bookmarks: 40,
  },
  {
    id: 'post-4',
    channel: 'Tiktok',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80&fit=crop',
    accountName: 'Toentoen',
    caption: 'Pilihan menu sehat dan segar dari petani lokal di sekitarmu, cepat dan berkualitas.',
    likes: 19,
    comments: 14,
    views: 28,
    reposts: 8,
    bookmarks: 22,
  },
  {
    id: 'post-5',
    channel: 'Facebook',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&q=80&fit=crop',
    accountName: 'Toentoen',
    caption: 'Kiat sukses mengembangkan bisnis toko kelontong di era digital bersama ekosistem Toentoen.',
    likes: 52,
    comments: 29,
    views: 110,
    reposts: 24,
    bookmarks: 36,
  },
  {
    id: 'post-6',
    channel: 'Linkedin',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80&fit=crop',
    accountName: 'Toentoen',
    caption: 'Transformasi digital UMKM: Laporan performa dan tren pertumbuhan ekonomi lokal kuartal ini.',
    likes: 68,
    comments: 41,
    views: 145,
    reposts: 33,
    bookmarks: 58,
  },
];
