"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { adminService, TicketMessage } from '@/services/adminService';
import { 
  InboxTicketCardSkeleton, 
  ChatBubbleSkeleton, 
  CustomerProfileSkeleton 
} from '@/components/ui/Skeleton';
import { RoleGuard } from '@/components/auth/RoleGuard';

interface CustomerAccountOverview {
  account_since?: string;
  subscription?: string;
  current_status?: string;
  total_tickets_filed?: number;
  lifetime_csat_avg?: number;
  timezone?: string;
}

interface RecentActivityItem {
  id: string;
  date: string;
  title: string;
  status: string;
}

interface CustomerProfileDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url: string;
  is_vip: boolean;
  tier: string;
  account_overview?: CustomerAccountOverview;
  recent_activity?: RecentActivityItem[];
}

interface CannedResponse {
  id: string;
  title: string;
  category: string;
  badgeColor: string;
  text: string;
}

const CANNED_RESPONSES: CannedResponse[] = [
  {
    id: 'greeting',
    title: 'Konfirmasi Penerimaan',
    category: 'Salam',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    text: 'Halo Kak, terima kasih atas laporannya. Tim kami sedang meninjau kendala ini.'
  },
  {
    id: 'investigation',
    title: 'Investigasi Sistem',
    category: 'Pengecekan',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    text: 'Mohon ditunggu sebentar ya Kak, kami sedang memeriksa sistem pembayaran terkait.'
  },
  {
    id: 'resolved',
    title: 'Penyelesaian Transaksi',
    category: 'Solusi',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    text: 'Laporan transaksi telah berhasil kami selesaikan. Silakan cek saldo akun Kakak kembali ya.'
  },
  {
    id: 'closing',
    title: 'Konfirmasi Penutup',
    category: 'Follow-up',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    text: 'Apakah ada hal lain yang bisa kami bantu sebelum tiket ini kami selesaikan?'
  }
];

function SupervisorInboxContent() {
  const searchParams = useSearchParams();
  const queryTicketId = searchParams.get('id') || searchParams.get('ticketId');

  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [customerDetail, setCustomerDetail] = useState<CustomerProfileDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'queue' | 'solved'>('queue');
  const [filterType, setFilterType] = useState('All');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [adminTimezone, setAdminTimezone] = useState<string>('WIB');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);
  const templateBtnRef = useRef<HTMLButtonElement>(null);

  // Deteksi Zona Waktu Lokal Admin Browser
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === 'Asia/Jakarta' || tz === 'Asia/Pontianak') setAdminTimezone('WIB');
      else if (tz === 'Asia/Makassar' || tz === 'Asia/Ujung_Pandang') setAdminTimezone('WITA');
      else if (tz === 'Asia/Jayapura') setAdminTimezone('WIT');
      else {
        const parts = new Intl.DateTimeFormat('id-ID', { timeZoneName: 'short' }).formatToParts(new Date());
        const tzName = parts.find(p => p.type === 'timeZoneName')?.value;
        setAdminTimezone(tzName || 'WIB');
      }
    } catch {
      setAdminTimezone('WIB');
    }
  }, []);

  // Formatter Waktu Chat Presisi (Menyesuaikan UTC server ke Zona Waktu Lokal Admin)
  const formatChatTime = (createdAt?: string, fallbackTimestamp?: string) => {
    if (createdAt) {
      const d = new Date(createdAt);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');
      }
    }
    if (fallbackTimestamp) {
      return fallbackTimestamp.replace(':', '.');
    }
    return '10.00';
  };

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Tutup dropdown template jika klik di luar atau tekan tombol Esc
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        templatesRef.current && 
        !templatesRef.current.contains(e.target as Node) &&
        !templateBtnRef.current?.contains(e.target as Node)
      ) {
        setShowTemplates(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowTemplates(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // 1. Fetch tickets from backend based on activeTab
  useEffect(() => {
    let isMounted = true;
    const fetchSupervisorTickets = async () => {
      try {
        setLoading(true);
        // Untuk tab antrean supervisor, muat seluruh tiket aktif (antrean baru QUEUE maupun IN_PROGRESS yang sedang berjalan)
        const statusParam = activeTab === 'queue' ? 'all' : 'SOLVED';
        const res = await adminService.getTickets({ status: statusParam }).catch(() => null);
        
        if (isMounted) {
          if (res?.tickets && res.tickets.length > 0) {
            // Filter: tab antrean memuat tiket aktif yang belum SOLVED
            const rawList = activeTab === 'queue'
              ? res.tickets.filter((t: any) => t.status !== 'SOLVED' && t.status !== 'CLOSED')
              : res.tickets.filter((t: any) => t.status === 'SOLVED');

            const mapped = rawList.map((t: any, idx: number) => {
              const ticketId = t.ticket_id || t.id || `tkt-${idx + 1}`;
              const rawCode = t.ticket_id || t.ticket_code || t.code || t.id || `TK-${idx + 1}`;
              let sanitized = String(rawCode).replace(/^#+/, '').trim();
              sanitized = sanitized.replace(/-+/g, '-');
              if (sanitized.startsWith('-')) sanitized = sanitized.slice(1);
              const upper = sanitized.toUpperCase();
              if (!upper.startsWith('TK-') && !upper.startsWith('TCK-') && !upper.startsWith('TKT-') && !upper.startsWith('RPT-')) {
                sanitized = `TK-${sanitized}`;
              }
              const displayCode = `#${sanitized.toUpperCase()}`;
              const isVip = t.is_vip || t.priority === 'VIP' || t.customer?.is_vip || t.requester?.is_vip || false;
              const customerName = t.customer?.name || t.requester?.name || 'Pelanggan';
              const rawCustAvatar = t.customer?.avatar_url || t.requester?.avatar_url || t.customer?.avatar || t.avatar;
              const customerAvatar = (rawCustAvatar && !rawCustAvatar.includes('unsplash.com') && !rawCustAvatar.includes('pravatar.cc')) 
                ? rawCustAvatar 
                : "/assets/avatars/starter-photo-profile.jpg";
              const customerEmail = t.customer?.email || t.requester?.email || 'user@toentoen.com';
              const customerPhone = t.customer?.phone || t.requester?.phone || '-';
              const customerId = t.customer?.id || t.requester?.id || ticketId;

              return {
                id: displayCode,
                ticketId: ticketId,
                rawId: ticketId,
                agent: t.assignedTo || "Layla (Admin CS)",
                date: t.date || (t.updatedAt ? new Date(t.updatedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }) : "Hari ini"),
                rating: t.customer?.rating ?? t.rating ?? null,
                waitingTime: t.waiting_time || "5m 12s",
                chatTime: t.chat_time || "8m 30s",
                avatar: customerAvatar,
                type: isVip ? "VIP" : "Standard",
                priority: isVip ? "VIP" : "STANDARD",
                status: t.status || (activeTab === 'queue' ? 'QUEUE' : 'SOLVED'),
                subject: t.subject || "Pertanyaan Pelanggan",
                category: t.category || "Kendala Transaksi",
                channel: t.channel || "Web Chat",
                lastMessage: t.last_message || t.lastMessage || "Pesan tiket...",
                customer: {
                  id: customerId,
                  name: customerName,
                  email: customerEmail,
                  phone: customerPhone,
                  avatar: customerAvatar,
                  is_vip: isVip,
                  tier: isVip ? "VIP" : "STANDARD"
                },
              };
            });
            setTickets(mapped);

            // Pemilihan tiket otomatis: Utamakan query parameter ticketId jika ada
            let targetTicket: any = null;
            if (queryTicketId) {
              const cleanQuery = queryTicketId.replace(/^#+/, '').replace(/-+/g, '-').toLowerCase();
              
              // Ekstrak digit angka terakhir (contoh: 'tkt-2026-0003' -> 3, 'tk-003' -> 3)
              const extractDigits = (val: string) => {
                const match = val.match(/(\d+)$/);
                return match ? parseInt(match[1], 10) : null;
              };
              const queryNum = extractDigits(cleanQuery);

              targetTicket = mapped.find((m: any) => {
                const cleanId = String(m.id).replace(/^#+/, '').replace(/-+/g, '-').toLowerCase();
                const cleanTicketId = String(m.ticketId || '').replace(/^#+/, '').replace(/-+/g, '-').toLowerCase();
                const cleanRawId = String(m.rawId || '').replace(/^#+/, '').replace(/-+/g, '-').toLowerCase();
                
                // 1. Cek kecocokan nomor urut tiket
                if (queryNum !== null) {
                  const mNum = extractDigits(cleanId) ?? extractDigits(cleanTicketId) ?? extractDigits(cleanRawId);
                  if (mNum !== null && mNum === queryNum) return true;
                }

                // 2. Cek kecocokan string
                return cleanId === cleanQuery || 
                       cleanTicketId === cleanQuery || 
                       cleanRawId === cleanQuery || 
                       cleanId.includes(cleanQuery) || 
                       cleanQuery.includes(cleanRawId) ||
                       cleanQuery.includes(cleanTicketId);
              });
            }

            if (targetTicket) {
              setSelectedTicket(targetTicket);
            } else if (!selectedTicket || !mapped.some(m => m.id === selectedTicket.id)) {
              setSelectedTicket(mapped[0]);
            }
          } else {
            setTickets([]);
            setSelectedTicket(null);
          }
        }
      } catch (err) {
        console.error("Gagal load supervisor tickets", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSupervisorTickets();
    return () => { isMounted = false; };
  }, [activeTab]);

  // 2. Fetch ticket messages & customer profile when selectedTicket changes
  useEffect(() => {
    if (!selectedTicket) {
      setMessages([]);
      setCustomerDetail(null);
      return;
    }

    let isMounted = true;
    const fetchDetails = async () => {
      setLoadingChat(true);
      const ticketIdentifier = selectedTicket.ticketId || selectedTicket.rawId || selectedTicket.id;
      const customerIdentifier = selectedTicket.customer?.id;

      try {
        const [msgRes, profileRes] = await Promise.allSettled([
          adminService.getTicketMessages(ticketIdentifier),
          customerIdentifier ? adminService.getCustomerProfile(customerIdentifier) : Promise.reject('No customer id')
        ]);

        if (!isMounted) return;

        // 1. Pesan Tiket
        if (msgRes.status === 'fulfilled' && msgRes.value?.messages && msgRes.value.messages.length > 0) {
          setMessages(msgRes.value.messages);
        } else {
          setMessages([
            {
              id: 'initial',
              sender: 'CUSTOMER',
              senderName: selectedTicket.customer?.name || 'Pelanggan',
              message: selectedTicket.lastMessage || selectedTicket.subject || 'Halo admin, saya butuh bantuan terkait kendala transaksi saya.',
              createdAt: new Date().toISOString()
            }
          ]);
        }

        // 2. Profil Pelanggan Riil dari Backend
        const rawProfile: any = (profileRes.status === 'fulfilled' && profileRes.value) ? profileRes.value : null;
        
        const isVip = rawProfile?.is_vip ?? selectedTicket.customer?.is_vip ?? false;
        const profileAvatar = rawProfile?.avatar_url || selectedTicket.customer?.avatar || selectedTicket.avatar;
        setCustomerDetail({
          id: rawProfile?.customer_id || rawProfile?.id || selectedTicket.customer?.id || 'ACC-001',
          name: rawProfile?.name || selectedTicket.customer?.name || 'Pengguna ToenToen',
          email: rawProfile?.email || selectedTicket.customer?.email || 'user@toentoen.com',
          phone: rawProfile?.phone || selectedTicket.customer?.phone || '-',
          avatar_url: (profileAvatar && !profileAvatar.includes('unsplash.com') && !profileAvatar.includes('pravatar.cc')) 
            ? profileAvatar 
            : "/assets/avatars/starter-photo-profile.jpg",
          is_vip: false,
          tier: 'STANDARD',
          account_overview: rawProfile?.account_overview || {
            account_since: 'August 17, 2026',
            subscription: 'Standar',
            current_status: 'Active',
            total_tickets_filed: 1,
            lifetime_csat_avg: null,
            timezone: rawProfile?.timezone || rawProfile?.location_timezone || 'WIB (UTC+7)'
          },
          recent_activity: Array.isArray(rawProfile?.recent_activity) && rawProfile.recent_activity.length > 0 
            ? rawProfile.recent_activity 
            : [
                {
                  id: selectedTicket.id,
                  date: selectedTicket.date || 'Aug 2026',
                  title: selectedTicket.subject?.slice(0, 30) || 'Kendala Transaksi',
                  status: selectedTicket.status === 'SOLVED' ? 'Solved' : 'Pending'
                }
              ]
        });

      } catch (err) {
        console.error("Error fetching ticket conversation", err);
      } finally {
        if (isMounted) setLoadingChat(false);
      }
    };

    fetchDetails();
    return () => { isMounted = false; };
  }, [selectedTicket]);

  // Handle Update Status Tiket (PATCH /tickets/:id/status)
  const handleUpdateStatus = async (targetStatus?: string) => {
    if (!selectedTicket || isUpdatingStatus) return;
    const ticketIdentifier = selectedTicket.ticketId || selectedTicket.rawId || selectedTicket.id;
    const nextStatus = targetStatus || (selectedTicket.status === 'SOLVED' ? 'IN_PROGRESS' : 'SOLVED');

    setIsUpdatingStatus(true);
    try {
      await adminService.updateTicketStatus(ticketIdentifier, nextStatus);
      setSelectedTicket((prev: any) => prev ? { ...prev, status: nextStatus } : prev);
      setTickets((prev) => prev.map((t) => t.id === selectedTicket.id ? { ...t, status: nextStatus } : t));
    } catch (err: any) {
      console.error("Gagal update status tiket", err);
      alert(`Gagal mengubah status: ${err.message || 'Error server'}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle Send Message & Opsional Send and Solve (POST /tickets/:id/messages)
  const handleSendMessage = async (e?: React.FormEvent, solveTicket = false) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedTicket || sendingReply) return;

    const ticketIdentifier = selectedTicket.ticketId || selectedTicket.rawId || selectedTicket.id;
    const currentText = replyText.trim();
    setReplyText('');
    setSendingReply(true);

    try {
      const res = await adminService.sendTicketMessage(ticketIdentifier, currentText, solveTicket ? 'SOLVED' : undefined).catch(() => null);
      const newMsg: TicketMessage = res || {
        id: String(Date.now()),
        sender: 'AGENT',
        senderName: 'Dewi Lestari (Supervisor)',
        message: currentText,
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, newMsg]);

      if (solveTicket) {
        setSelectedTicket((prev: any) => prev ? { ...prev, status: 'SOLVED' } : prev);
        setTickets((prev) => prev.map((t) => t.id === selectedTicket.id ? { ...t, status: 'SOLVED' } : t));
      } else if (selectedTicket.status === 'QUEUE') {
        setSelectedTicket((prev: any) => prev ? { ...prev, status: 'IN_PROGRESS' } : prev);
        setTickets((prev) => prev.map((t) => t.id === selectedTicket.id ? { ...t, status: 'IN_PROGRESS' } : t));
      }
    } catch (err) {
      console.error("Gagal kirim pesan", err);
    } finally {
      setSendingReply(false);
    }
  };

  // Helper Copy Clipboard
  const handleCopy = (text: string, fieldName: string) => {
    if (!text || text === '-') return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="flex h-full min-h-0 bg-white text-gray-800 font-sans overflow-hidden">
      
      {/* ================= COLUMN 1: TICKET LIST ================= */}
      <div className={`${mobileView === 'chat' ? 'hidden md:flex' : 'flex'} w-full md:w-72 lg:w-80 border-r border-gray-200 flex-col h-full bg-white shrink-0`}>
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Inbox</h1>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200/60 px-2 py-0.5 rounded-full">
              Supervisor View
            </span>
          </div>
          
          {/* Search Box */}
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Cari tiket atau pelanggan..." 
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 bg-gray-50/50"
            />
          </div>

          {/* Queue / Solved Toggle */}
          <div className="flex space-x-1.5 text-xs font-semibold p-1 bg-gray-100 rounded-xl">
            <button 
              onClick={() => setActiveTab('queue')}
              className={`flex-1 py-1.5 rounded-lg transition-all duration-200 flex items-center justify-center space-x-1.5 ${
                activeTab === 'queue' ? 'bg-white text-teal-800 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>Antrean</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'queue' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {tickets.length}
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('solved')}
              className={`flex-1 py-1.5 rounded-lg transition-all duration-200 flex items-center justify-center space-x-1.5 ${
                activeTab === 'solved' ? 'bg-white text-teal-800 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>Selesai</span>
            </button>
          </div>

          {/* Sub Filters */}
          <div className="flex items-center space-x-1 text-xs pt-0.5">
            {['All', 'VIP', 'Standard'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                  filterType === type 
                    ? 'bg-teal-600 text-white shadow-xs font-semibold' 
                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Ticket Items Scrollable */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {loading && (
            Array.from({ length: 5 }).map((_, i) => (
              <InboxTicketCardSkeleton key={i} />
            ))
          )}
          {!loading && tickets.length === 0 && (
            <div className="text-center py-12 text-xs text-gray-400">
              Tidak ada tiket dalam daftar ini.
            </div>
          )}
          {!loading && tickets
            .filter((t) => filterType === 'All' || t.type === filterType)
            .map((ticket, idx) => {
            const isSelected = selectedTicket?.id === ticket.id;
            return (
              <div
                key={`ticket-${ticket.ticketId || ticket.id}-${idx}`}
                onClick={() => { setSelectedTicket(ticket); setMobileView('chat'); }}
                className={`p-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                  isSelected 
                    ? 'border-teal-500 bg-teal-50/50 shadow-sm ring-1 ring-teal-500/50' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative shrink-0">
                    <img 
                      src={ticket.avatar || "/assets/avatars/starter-photo-profile.jpg"} 
                      alt="Avatar" 
                      onError={(e) => { e.currentTarget.src = "/assets/avatars/starter-photo-profile.jpg"; }}
                      className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-2xs" 
                    />
                    {ticket.status !== 'SOLVED' && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-900 truncate">{ticket.customer?.name || ticket.agent}</h4>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        ticket.type === 'VIP' 
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 shadow-2xs' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {ticket.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-[11px] truncate font-medium">{ticket.subject}</p>
                    <div className="flex justify-between items-center text-gray-400 text-[10px] pt-0.5">
                      <span className="font-semibold text-gray-700">{ticket.id}</span>
                      <span>{ticket.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= COLUMN 2: CHAT CONVERSATION ================= */}
      <div className={`${mobileView === 'list' ? 'hidden md:flex' : 'flex'} flex-1 min-w-0 flex-col h-full bg-gray-50/40 xl:border-r border-gray-200`}>
        
        {/* Chat Header */}
        {selectedTicket ? (
          <div className="p-3.5 sm:p-4 border-b border-gray-200 bg-white flex justify-between items-center gap-3 shrink-0 shadow-2xs">
            <button
              type="button"
              onClick={() => setMobileView('list')}
              className="md:hidden -ml-1 p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 shrink-0"
              aria-label="Kembali ke daftar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold text-gray-900 truncate">{selectedTicket.subject}</h2>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200 shrink-0">
                  {selectedTicket.category || 'Transaksi'}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                <span className="font-semibold text-gray-700">{selectedTicket.id}</span> • Pelanggan: <span className="font-semibold text-gray-800">{selectedTicket.customer?.name || 'Customer'}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 text-gray-400 text-sm">Pilih tiket untuk melihat percakapan</div>
        )}

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* Date Separator Pill */}
          <div className="flex items-center justify-center my-3">
            <span className="bg-gray-200/80 text-gray-600 text-[10px] font-semibold px-3 py-1 rounded-full shadow-2xs">
              {selectedTicket?.date ? `Sesi ${selectedTicket.date}` : 'Hari ini'} • Waktu lokal Anda ({adminTimezone})
            </span>
          </div>

          {loadingChat ? (
            <ChatBubbleSkeleton />
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-400">Belum ada riwayat pesan dalam tiket ini.</div>
          ) : (
            messages.map((msg, idx) => {
            const isSystem = msg.sender === 'SYSTEM' || msg.sender_type === 'SYSTEM' || msg.is_auto_reply || (msg.senderName && msg.senderName.includes('Auto-Responder'));
            const isUser = !isSystem && (msg.sender === 'CUSTOMER' || msg.sender === 'user' || msg.sender === 'client' || msg.sender_type === 'CUSTOMER' || msg.sender_type === 'MERCHANT');
            const timeStr = formatChatTime(msg.createdAt, msg.timestamp);

            return isUser ? (
              <div key={`msg-user-${msg.id || 'm'}-${idx}`} className="flex items-start space-x-3 max-w-xl">
                <img 
                  src={customerDetail?.avatar_url || selectedTicket?.avatar || "/assets/avatars/starter-photo-profile.jpg"} 
                  alt="Customer" 
                  onError={(e) => { e.currentTarget.src = "/assets/avatars/starter-photo-profile.jpg"; }}
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200 shadow-2xs" 
                />
                <div className="bg-white border border-gray-200/90 rounded-2xl rounded-tl-sm p-4 shadow-2xs text-gray-800 space-y-1">
                  <h5 className="font-bold text-gray-900 text-xs">{msg.senderName || customerDetail?.name || 'Pelanggan'}</h5>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  <span className="text-[10px] text-gray-400 block text-right pt-1">
                    {timeStr} <span className="text-[9px] text-gray-400 font-medium">{adminTimezone}</span>
                  </span>
                </div>
              </div>
            ) : (
              <div key={`msg-agent-${msg.id || 'm'}-${idx}`} className="flex justify-end">
                <div className="bg-teal-100/90 border border-teal-200/90 rounded-2xl rounded-tr-sm p-4 max-w-xl text-gray-800 space-y-1 shadow-2xs">
                  <div className="flex items-center space-x-2">
                    <h5 className="font-bold text-gray-900 text-xs">
                      {msg.senderName || (isSystem ? 'ToenToen Auto-Responder' : 'You')}
                    </h5>
                    {isSystem && (
                      <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded-full bg-teal-200 text-teal-800">
                        SISTEM
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  <div className="flex justify-end items-center space-x-1 text-[10px] text-teal-800 pt-1 font-medium">
                    <span>{timeStr} {adminTimezone}</span>
                    <span className="text-teal-600 font-black">✓✓</span>
                  </div>
                </div>
              </div>
            );
          }))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar Kirim Balasan Pesan & Opsi Send and Solve */}
        {selectedTicket && (
          <div className="p-3 border-t border-gray-200 bg-white relative">
            
            {/* Pop-up Canned Responses Template */}
            {showTemplates && (
              <div 
                ref={templatesRef}
                className="absolute bottom-full left-3 mb-3 w-[92vw] max-w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 overflow-hidden"
              >
                {/* Header Popup */}
                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 via-teal-50/40 to-white border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 leading-tight">Template Balasan Cepat</h4>
                      <p className="text-[10px] text-gray-400">Pilih pesan instan untuk mengisi balasan</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowTemplates(false)} 
                    className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Tutup (Esc)"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* List Template Items */}
                <div className="p-2.5 max-h-[320px] overflow-y-auto space-y-2 custom-scrollbar">
                  {CANNED_RESPONSES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => { setReplyText(tmpl.text); setShowTemplates(false); }}
                      className="w-full text-left p-3 rounded-xl border border-gray-100/90 bg-gray-50/30 hover:bg-teal-50/60 hover:border-teal-300 hover:shadow-xs transition-all duration-150 group flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-xs text-gray-900 group-hover:text-teal-800 transition-colors">
                          {tmpl.title}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tmpl.badgeColor}`}>
                          {tmpl.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 group-hover:text-gray-900 leading-relaxed font-normal break-words">
                        "{tmpl.text}"
                      </p>
                    </button>
                  ))}
                </div>

                {/* Footer Petunjuk */}
                <div className="px-4 py-2 bg-gray-50/80 border-t border-gray-100 text-[10px] text-gray-500 flex items-center justify-between">
                  <span>💡 Klik salah satu untuk mengisi ke kotak input</span>
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[9px] font-mono text-gray-400 shadow-2xs">ESC</kbd>
                </div>
              </div>
            )}

            <form onSubmit={(e) => handleSendMessage(e, false)} className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
              
              {/* Shortcut Tombol Template Cepat */}
              <button
                ref={templateBtnRef}
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                className={`p-2 rounded-lg transition-all shrink-0 ${
                  showTemplates 
                    ? 'text-teal-600 bg-teal-50 ring-2 ring-teal-500/30 shadow-2xs' 
                    : 'text-gray-500 hover:text-teal-600 hover:bg-teal-50'
                }`}
                title="Pilih balasan template cepat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>

              <input 
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tulis instruksi supervisor atau balasan tiket..."
                className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 bg-gray-50/40"
              />

              <button
                type="submit"
                disabled={sendingReply || !replyText.trim()}
                className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
              >
                {sendingReply ? 'Mengirim...' : 'Kirim'}
              </button>

              {selectedTicket.status !== 'SOLVED' && (
                <button
                  type="button"
                  onClick={() => handleSendMessage(undefined, true)}
                  disabled={sendingReply || !replyText.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap flex items-center space-x-1 shadow-2xs"
                  title="Kirim pesan balasan sekaligus tandai tiket SOLVED"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Kirim & Selesaikan</span>
                </button>
              )}
            </form>
          </div>
        )}
      </div>

      {/* ================= COLUMN 3: CUSTOMER PROFILE SIDEBAR (LIVE BACKEND) ================= */}
      {selectedTicket && (
        <div className="animate-slide-in-right w-80 p-4 border-l border-gray-200 h-full overflow-y-auto space-y-4 shrink-0 bg-white">
          
          {/* Header Panel Profil dengan Tombol Tutup */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Profil Pelanggan</span>
            <button
              type="button"
              onClick={() => setSelectedTicket(null)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Tutup panel profil"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loadingChat && !customerDetail ? (
            <CustomerProfileSkeleton />
          ) : (
            <>
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center space-y-1">
            <div className="relative">
              <img 
                src={customerDetail?.avatar_url || selectedTicket?.avatar || "/assets/avatars/starter-photo-profile.jpg"} 
                alt="Customer" 
                onError={(e) => { e.currentTarget.src = "/assets/avatars/starter-photo-profile.jpg"; }}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" 
              />
              <span className={`absolute -bottom-1 -right-1 text-[9px] font-black px-2 py-0.5 rounded-full uppercase border border-white ${
                customerDetail?.is_vip 
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 shadow-2xs' 
                  : 'bg-teal-600 text-white'
              }`}>
                {customerDetail?.tier || 'STANDARD'}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-sm mt-1">
              {customerDetail?.name || selectedTicket?.customer?.name || "Pengguna ToenToen"}
            </h3>

            {/* Email dengan tombol Copy 1-klik */}
            <div className="flex items-center space-x-1 text-[11px] text-gray-500 group">
              <span>{customerDetail?.email || selectedTicket?.customer?.email || "email@toentoen.com"}</span>
              <button
                type="button"
                onClick={() => handleCopy(customerDetail?.email || selectedTicket?.customer?.email, 'email')}
                className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
                title="Salin email"
              >
                {copiedField === 'email' ? (
                  <span className="text-[10px] text-emerald-600 font-bold">✓</span>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                )}
              </button>
            </div>

            {/* Telepon dengan tombol Copy 1-klik */}
            <div className="flex items-center space-x-1 text-[11px] text-gray-500 group">
              <span>{customerDetail?.phone || selectedTicket?.customer?.phone || "-"}</span>
              <button
                type="button"
                onClick={() => handleCopy(customerDetail?.phone || selectedTicket?.customer?.phone, 'phone')}
                className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
                title="Salin nomor telepon"
              >
                {copiedField === 'phone' ? (
                  <span className="text-[10px] text-emerald-600 font-bold">✓</span>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                )}
              </button>
            </div>
          </div>

          {/* Account Overview Box (Live dari GET /customers/:id) */}
          <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-4 space-y-2.5 text-xs shadow-2xs">
            <h4 className="font-bold text-gray-900 text-xs mb-2">Account Overview</h4>
            
            <div className="flex justify-between text-gray-600">
              <span>Terdaftar Sejak</span>
              <span className="font-semibold text-gray-900">{customerDetail?.account_overview?.account_since || '-'}</span>
            </div>
            <div className="flex justify-between items-start text-gray-600 gap-2">
              <span className="shrink-0">Paket Langganan</span>
              <span className="font-semibold text-gray-900 text-right">{customerDetail?.account_overview?.subscription || 'Standar'}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Status Akun</span>
              <span className="font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.2 rounded-full text-[11px]">
                {customerDetail?.account_overview?.current_status || 'Active'}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Zona Waktu Pelanggan</span>
              <span className="font-semibold text-gray-900">{customerDetail?.account_overview?.timezone || 'WIB (UTC+7)'}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Total Tiket Masuk</span>
              <span className="font-semibold text-gray-900">{customerDetail?.account_overview?.total_tickets_filed ?? 1}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Rata-rata Kepuasan</span>
              {customerDetail?.account_overview?.lifetime_csat_avg ? (
                <span className="font-bold text-amber-600 flex items-center space-x-1">
                  <span>★</span>
                  <span>{customerDetail.account_overview.lifetime_csat_avg} / 5.0</span>
                </span>
              ) : (
                <span className="font-medium text-gray-400">Belum ada rating</span>
              )}
            </div>
          </div>

          {/* Current Ticket Box */}
          <div className="border border-gray-200 rounded-xl p-4 space-y-3 text-xs bg-white shadow-2xs">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-900 text-xs">Tiket Saat Ini</h4>
                <p className="text-gray-500 text-[11px] font-medium">{selectedTicket.id}</p>
              </div>
              <span className={`inline-flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                selectedTicket.status === 'SOLVED' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-teal-50 text-teal-700 border-teal-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  selectedTicket.status === 'SOLVED' ? 'bg-emerald-500' : 'bg-teal-500'
                }`}></span>
                <span>{selectedTicket.status === 'SOLVED' ? 'Terselesaikan' : 'Aktif'}</span>
              </span>
            </div>

            <p className="font-semibold text-gray-800 leading-snug">{selectedTicket.subject}</p>
            
            {/* Tombol Aksi Selesaikan / Buka Kembali Tiket */}
            <div className="pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => handleUpdateStatus()}
                disabled={isUpdatingStatus}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-2xs cursor-pointer ${
                  selectedTicket.status === 'SOLVED'
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                } disabled:opacity-50`}
              >
                {isUpdatingStatus ? (
                  <span>Memproses...</span>
                ) : selectedTicket.status === 'SOLVED' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Buka Kembali Tiket</span>
                  </>
                ) : (
                  <>
                    <span>Selesaikan Tiket</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Recent Activity Box (Live dari Backend) */}
          {customerDetail?.recent_activity && customerDetail.recent_activity.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-4 space-y-3 text-xs bg-white shadow-2xs">
              <h4 className="font-bold text-gray-900 text-xs">Aktivitas Terakhir</h4>
              
              <div className="space-y-2 text-[11px]">
                {customerDetail.recent_activity.map((act, idx) => (
                  <div key={act.id || idx} className="flex justify-between items-center text-gray-600">
                    <span className="text-gray-400 font-medium">{act.date}</span>
                    <span className="font-semibold text-gray-800 truncate max-w-[140px]">{act.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{act.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

            </>
          )}

        </div>
      )}

    </div>
  );
}

export default function SupervisorInboxPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN_SPV', 'SUPERVISOR_ADMIN', 'ADMIN']}>
      <Suspense fallback={<div className="p-8 text-center text-xs text-gray-400">Memuat Inbox...</div>}>
        <SupervisorInboxContent />
      </Suspense>
    </RoleGuard>
  );
}
