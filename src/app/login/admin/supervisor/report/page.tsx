"use client";

import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { adminService } from '@/services/adminService';
import { adminApi } from '@/constants/api/admin/report';
import { KanbanCardSkeleton } from '@/components/ui/Skeleton';
import { RoleGuard } from '@/components/auth/RoleGuard';

const fallbackSidebarMenus = [
  {
    title: "Merchant / Business",
    items: ["Fraud / Scam", "Fake Business", "Illegal Products", "Non-responsive Merchant"]
  },
  {
    title: "Products & Listings",
    items: ["Counterfeit / KW", "Prohibited Items", "Misleading Specification", "Expired Goods"]
  },
  {
    title: "Social Posts",
    items: ["Spam", "Hate Speech", "Inappropriate Media", "Copyright Infringement"]
  },
  {
    title: "Reviews & Ratings",
    items: ["Defamation", "Fake Reviews", "Offensive Language", "Competitor Sabotage"]
  },
  {
    title: "Post Comments",
    items: ["Harassment", "Spam Links / Phishing", "Threats", "Profanity"]
  }
];

function SupervisorReportContent() {
  const searchParams = useSearchParams();
  const queryReportId = searchParams.get('id') || searchParams.get('reportId');

  const [tickets, setTickets] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [sidebarMenus, setSidebarMenus] = useState(fallbackSidebarMenus);
  const [loading, setLoading] = useState(true);
  const [headerTab, setHeaderTab] = useState<'REPORT' | 'TICKET'>('REPORT');
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null); // null = All Staff Admin
  const [staffSearchQuery, setStaffSearchQuery] = useState("");
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [expandedMenu, setExpandedMenu] = useState<string>("Merchant / Business");
  const [activeCategory, setActiveCategory] = useState<string>("ALL"); // 'ALL' = Semua Laporan
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [showFlagMenu, setShowFlagMenu] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Retrieve Kanban tickets, category taxonomies, and supervisor evaluations
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const [boardRes, catRes, staffRes, evalRes] = await Promise.allSettled([
          adminApi.getKanbanBoard(),
          adminApi.getReportCategories(),
          adminApi.getAdminStaff('ALL'),
          adminService.getSupervisorEvaluations()
        ]);

        if (!isMounted) return;

        // Retrieve administrative staff directory
        if (staffRes.status === 'fulfilled' && Array.isArray(staffRes.value) && staffRes.value.length > 0) {
          const mapped = staffRes.value.map((s: any, idx: number) => ({
            id: s.id || s.worker_id || `ADM-${101 + idx}`,
            name: s.name || "Staff Admin",
            role: s.role || `Staff Admin - Tier 1`,
            avatar: s.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
          }));
          setStaffList(mapped);
        } else if (evalRes.status === 'fulfilled' && evalRes.value?.evaluations?.length) {
          const mapped = evalRes.value.evaluations.map((e, idx) => ({
            id: e.agentId || `SA-${idx + 1}`,
            name: e.agentName || "Staff Admin",
            role: `Staff Admin - ${e.slaBreaches === 0 ? 'Tier 1' : 'Tier 2'}`,
            avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
          }));
          setStaffList(mapped);
        } else {
          setStaffList([
            { id: 'ADM-101', name: 'Budi Santoso', role: 'Staff Admin - Tier 1', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
            { id: 'ADM-102', name: 'Citra Amelia', role: 'Staff Admin - Tier 2', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
          ]);
        }

        // Retrieve report category taxonomy
        if (catRes.status === 'fulfilled' && Array.isArray(catRes.value?.data)) {
          const cats = catRes.value.data.filter((c: any) => c.key !== 'all');
          if (cats.length > 0) {
            const mappedMenus = cats.map((c: any) => ({
              title: c.label || c.key,
              items: Array.isArray(c.subcategories) ? c.subcategories : [c.label]
            }));
            setSidebarMenus(mappedMenus);
            if (mappedMenus[0]) {
              setExpandedMenu(mappedMenus[0].title);
            }
          }
        }

        // Retrieve Kanban ticket records
        const defaultCategories = [
          { cat: "Merchant / Business", sub: "Fraud / Scam", type: "report" },
          { cat: "Merchant / Business", sub: "Fake Business", type: "report" },
          { cat: "Products & Listings", sub: "Counterfeit / KW", type: "ticket" },
          { cat: "Social Posts", sub: "Spam", type: "report" },
          { cat: "Reviews & Ratings", sub: "Fake Reviews", type: "report" },
          { cat: "Post Comments", sub: "Harassment", type: "ticket" }
        ];

        if (boardRes.status === 'fulfilled' && boardRes.value?.data?.columns) {
          const cols = boardRes.value.data.columns;
          const mappedTickets: any[] = [];

          const parseCol = (items: any[], group: 'unsolved' | 'pending' | 'solved') => {
            if (!Array.isArray(items)) return;
            items.forEach((item: any, idx: number) => {
              const def = defaultCategories[(idx + (group === 'pending' ? 1 : group === 'solved' ? 2 : 0)) % defaultCategories.length];
              
              // Support nested assigned_staff object or flat fields
              const assignedId = item.assigned_staff?.id || item.assignedTo || item.assigned_to || (idx % 2 === 0 ? 'ADM-101' : 'ADM-102');
              const assignedName = item.assigned_staff?.name || item.assignedStaffName || item.assigned_staff_name || (idx % 2 === 0 ? 'Budi Santoso' : 'Citra Amelia');
              const reporterName = item.reporter?.name || item.customerName || item.reporterName || item.customer?.name || 'Pelanggan';
              const reporterAvatar = item.reporter?.avatar_url || item.avatar || item.customer?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150';
              const ticketCode = item.report_code || (item.id ? (String(item.id).startsWith('#') ? item.id : `#${item.id}`) : `#TK-${group.toUpperCase().slice(0, 2)}-${100 + idx}`);
              const issueText = item.description || item.reason || item.issue || item.subject || (idx === 0 ? 'saya melakukan pesanan ke toko ayam kopdes, ternyata ada di hutan, saya terkena scam' : 'Laporan Pengguna');
              const rawType = (item.type || (item.report_code ? 'report' : def.type)).toLowerCase();
              const finalType = rawType === 'support_ticket' ? 'ticket' : rawType;

              mappedTickets.push({
                id: ticketCode,
                rawId: item.report_id || item.id,
                statusGroup: group,
                assignedTo: assignedId,
                assignedStaffName: assignedName,
                name: reporterName,
                role: item.target_type === 'business' ? '(Merchant)' : (item.role || (idx % 2 === 0 ? '(User)' : '(Merchant)')),
                isVip: item.priority === 'HIGH' || item.isVip || item.priority === 'VIP',
                issue: issueText,
                targetName: item.target_name,
                category: item.category || item.reportCategory || item.parent_category || def.cat,
                subcategory: item.subcategory || item.sub_category || item.reason || def.sub,
                type: finalType,
                evidence: Array.isArray(item.evidence) ? item.evidence : [],
                time: item.elapsed_time || item.time || (item.created_at || item.createdAt ? new Date(item.created_at || item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '10.00'),
                avatar: reporterAvatar,
                duration: item.elapsed_time || item.duration || '10m',
                flag: item.flag || { type: group === 'unsolved' ? 'red' : group === 'pending' ? 'orange' : 'green', count: 1 },
                messages: Array.isArray(item.messages) && item.messages.length > 0 
                  ? item.messages 
                  : [{ sender: 'user', text: item.description || item.reason || item.lastMessage || 'Laporan telah diajukan dan sedang diproses tim.' }]
              });
            });
          };

          parseCol(cols.unsolved, 'unsolved');
          parseCol(cols.pending, 'pending');
          parseCol(cols.solved, 'solved');

          setTickets(mappedTickets);

          if (queryReportId) {
            const cleanQ = queryReportId.replace(/^#+/, '').toLowerCase();
            const match = mappedTickets.find((t: any) => {
              const rawId = String(t.rawId || '').replace(/^#+/, '').toLowerCase();
              const id = String(t.id || '').replace(/^#+/, '').toLowerCase();
              return rawId === cleanQ || id === cleanQ || rawId.includes(cleanQ) || cleanQ.includes(rawId);
            });
            if (match) {
              setSelectedTicket(match);
              setHeaderTab('REPORT');
            }
          }
        } else {
          // Baseline ticket records fallback
          const fallbackList = [
            { id: 'UN-100', status: 'QUEUE', subject: 'Laporan Pengguna: Penipuan Toko Hutan Kopdes', cat: 'Merchant / Business', sub: 'Fraud / Scam', type: 'report', staffId: 'ADM-101', staffName: 'Budi Santoso', targetName: 'Toko Ayam Kopdes' },
            { id: 'PE-100', status: 'IN_PROGRESS', subject: 'Laporan Pengguna: Toko Fiktif Belum Kirim Barang', cat: 'Merchant / Business', sub: 'Fake Business', type: 'report', staffId: 'ADM-101', staffName: 'Budi Santoso', targetName: 'Berkah Elektronik' },
            { id: 'SO-100', status: 'SOLVED', subject: 'Kendala Support: Permintaan Verifikasi Rekening Bank', cat: 'Products & Listings', sub: 'Counterfeit / KW', type: 'ticket', staffId: 'ADM-102', staffName: 'Citra Amelia' },
            { id: 'UN-101', status: 'QUEUE', subject: 'Laporan Konten: Postingan Promosi Ilegal', cat: 'Social Posts', sub: 'Spam', type: 'report', staffId: 'ADM-102', staffName: 'Citra Amelia' },
            { id: 'PE-101', status: 'IN_PROGRESS', subject: 'Kendala Support: Gagal Top-up Saldo Akun Bisnis', cat: 'Merchant / Business', sub: 'Non-responsive Merchant', type: 'ticket', staffId: 'ADM-101', staffName: 'Budi Santoso' }
          ];

          const mappedTickets = fallbackList.map((t, idx) => ({
            id: `#TK-${t.id}`,
            rawId: t.id,
            statusGroup: t.status === 'SOLVED' ? 'solved' : t.status === 'QUEUE' ? 'unsolved' : 'pending',
            assignedTo: t.staffId,
            assignedStaffName: t.staffName,
            name: idx % 2 === 0 ? 'Pelanggan' : 'Ricky Jo',
            role: '(User)',
            isVip: idx === 0,
            issue: t.subject,
            targetName: t.targetName,
            category: t.cat,
            subcategory: t.sub,
            type: t.type,
            evidence: [],
            time: '10.00',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            duration: '8m',
            flag: { type: idx === 0 ? 'red' : 'green', count: 1 },
            messages: [{ sender: 'user', text: t.subject }]
          }));
          setTickets(mappedTickets);
        }
      } catch (err) {
        console.error("Gagal memuat supervisor report kanban", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, []);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStaffDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Consolidated staff directory with performance evaluations
  const combinedStaffList = useMemo(() => {
    const map = new Map<string, any>();
    staffList.forEach(s => map.set(s.id, s));
    tickets.forEach(t => {
      if (t.assignedStaffName && !map.has(t.assignedTo)) {
        map.set(t.assignedTo, {
          id: t.assignedTo,
          name: t.assignedStaffName,
          role: 'Staff Admin',
          avatar: t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        });
      }
    });
    return Array.from(map.values());
  }, [staffList, tickets]);
  const filteredTickets = useMemo(() => {
    let result = tickets;
    if (headerTab === 'REPORT') {
      result = result.filter(t => t.type === 'report');
    } else if (headerTab === 'TICKET') {
      result = result.filter(t => t.type === 'ticket');
    }
    if (selectedStaff) {
      result = result.filter(t => 
        t.assignedTo === selectedStaff.id || 
        (t.assignedStaffName && selectedStaff.name && t.assignedStaffName.toLowerCase().includes(selectedStaff.name.toLowerCase()))
      );
    }
    if (activeCategory && activeCategory !== 'ALL' && activeCategory !== 'All Reports') {
      result = result.filter(t => {
        const cat = (t.category || '').toLowerCase();
        const sub = (t.subcategory || '').toLowerCase();
        const issue = (t.issue || '').toLowerCase();
        const target = activeCategory.toLowerCase();
        return cat.includes(target) || sub.includes(target) || issue.includes(target);
      });
    }

    return result;
  }, [tickets, headerTab, selectedStaff, activeCategory]);
  const unsolvedTickets = useMemo(() => filteredTickets.filter(t => t.statusGroup === 'unsolved'), [filteredTickets]);
  const pendingTickets = useMemo(() => filteredTickets.filter(t => t.statusGroup === 'pending'), [filteredTickets]);
  const solvedTickets = useMemo(() => filteredTickets.filter(t => t.statusGroup === 'solved'), [filteredTickets]);
  useEffect(() => {
    if (selectedTicket) {
      const isStillVisible = filteredTickets.some(t => t.id === selectedTicket.id);
      if (!isStillVisible) {
        setSelectedTicket(null);
      }
    }
  }, [selectedStaff, activeCategory, headerTab, filteredTickets, selectedTicket]);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [selectedTicket?.messages]);

  const handleSelectTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowFlagMenu(false);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedTicket) return;
    
    const newMessage = { sender: 'admin', text: chatInput };
    const updatedTicket = { ...selectedTicket, messages: [...selectedTicket.messages, newMessage] };
    
    setSelectedTicket(updatedTicket);
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setChatInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAction = async (actionName: string) => {
    if (!selectedTicket) return;
    const cleanId = String(selectedTicket.id).replace('#', '');
    try {
      await adminApi.postAdjudication(cleanId, actionName.toLowerCase()).catch(() => null);
    } catch (e) {
    }
    alert(`Aksi [${actionName}] dipilih. Tiket ${selectedTicket.id} ditindaklanjuti.`);
    setTickets(prev => prev.filter(t => t.id !== selectedTicket.id));
    setSelectedTicket(null);
  };

  const handleSetPriority = (level: number) => {
    alert(`Prioritas tiket ${selectedTicket?.id} diubah ke Prioritas ${level}`);
    setShowFlagMenu(false);
  };
  const renderKanbanCard = (ticket: any, group: string, idx: number) => {
    const isSelected = selectedTicket?.id === ticket.id;
    return (
      <div 
        key={`${group}-${ticket.id}-${idx}`} 
        onClick={() => handleSelectTicket(ticket)} 
        className={`border rounded-xl p-3.5 bg-white shadow-2xs hover:shadow-sm cursor-pointer relative transition-all duration-200 h-[146px] flex flex-col justify-between ${
          isSelected 
            ? 'border-teal-500 bg-teal-50/20 ring-1 ring-teal-500 shadow-teal-50' 
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/40'
        }`}
      >
        <div className="flex items-start space-x-3 min-w-0">
          <img 
            src={ticket.avatar} 
            alt="Avatar" 
            className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-100 shadow-2xs" 
          />
          <div className="flex-1 min-w-0 text-xs">
            <div className="flex items-center space-x-1.5 mb-1 h-5">
              <span className="font-bold text-gray-900 truncate max-w-[130px]">{ticket.name}</span>
              <span className="text-gray-400 text-[11px] shrink-0">{ticket.role}</span>
              {ticket.isVip && (
                <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase shrink-0">
                  VIP
                </span>
              )}
            </div>
            <p className="text-gray-600 line-clamp-2 leading-relaxed text-[11px] h-8 overflow-hidden">
              {ticket.issue}
            </p>
          </div>
        </div>

        <div className="space-y-1.5 pt-1.5 border-t border-gray-100">
          <div className="flex items-center justify-between text-[11px]">
            <span className="inline-flex items-center text-[10px] bg-gray-100/90 text-gray-600 px-2 py-0.5 rounded border border-gray-200/70 font-medium truncate max-w-[155px]">
              Admin:&nbsp;<b className="text-gray-800 font-semibold truncate">{ticket.assignedStaffName || 'Staff Admin'}</b>
            </span>

            <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-medium shrink-0">
              <span className="font-semibold text-gray-400">{ticket.id}</span>
              <span>{ticket.duration || ticket.time || '10m'}</span>
            </div>
          </div>
        </div>

        {isSelected && (
          <div className="absolute right-0 top-3 bottom-3 w-1.5 bg-teal-500 rounded-l-full"></div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-50 font-sans overflow-hidden">
      
      {/* 1. TOP HEADER */}
      <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 lg:gap-6 min-w-0">
          <h1 className="text-lg sm:text-xl font-extrabold text-gray-900">Report & Support Ticket</h1>
          
          {/* Header Tab: Report vs Support Ticket */}
          <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden text-sm font-medium shadow-2xs">
            <button 
              type="button"
              onClick={() => setHeaderTab('REPORT')}
              className={`px-5 py-1.5 transition-colors cursor-pointer ${headerTab === 'REPORT' ? 'bg-teal-500 text-white font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Report
            </button>
            <button 
              type="button"
              onClick={() => setHeaderTab('TICKET')}
              className={`px-5 py-1.5 transition-colors cursor-pointer ${headerTab === 'TICKET' ? 'bg-teal-500 text-white font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Support Ticket
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="font-bold text-gray-700">Filter Admin</span>
            
            {/* SELECTOR FILTER STAFF ADMIN */}
            <div className="relative" ref={dropdownRef}>
              <button 
                type="button"
                onClick={() => setShowStaffDropdown(!showStaffDropdown)}
                className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-1.5 bg-white text-sm font-medium w-48 sm:w-56 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors text-left shadow-2xs cursor-pointer"
              >
                <span className="truncate text-gray-800">
                  {selectedStaff ? selectedStaff.name : "Semua Staff Admin"}
                </span>
                <svg className={`w-4 h-4 ml-2 text-gray-400 transition-transform shrink-0 ${showStaffDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* DROPDOWN MENU */}
              {showStaffDropdown && (
                <div className="absolute top-full mt-1 left-0 w-64 max-w-[calc(100vw-1.5rem)] bg-white border border-gray-200 shadow-xl rounded-lg z-50 py-1 overflow-hidden">
                  <div className="px-2 pb-2 pt-1.5 border-b border-gray-100">
                    <input 
                      type="text" 
                      placeholder="Cari staff..." 
                      value={staffSearchQuery}
                      onChange={(e) => setStaffSearchQuery(e.target.value)}
                      className="w-full px-2.5 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 bg-gray-50"
                      autoFocus
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    <div 
                      onClick={() => {
                        setSelectedStaff(null);
                        setShowStaffDropdown(false);
                        setStaffSearchQuery("");
                      }}
                      className={`px-3 py-2 text-xs font-bold cursor-pointer border-b border-gray-100 flex items-center justify-between transition-colors ${!selectedStaff ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50 text-gray-700'}`}
                    >
                      <span>Semua Staff Admin</span>
                      <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-bold">
                        {tickets.length}
                      </span>
                    </div>

                    {combinedStaffList
                      .filter(s => s.name.toLowerCase().includes(staffSearchQuery.toLowerCase()))
                      .map(staff => {
                        const isSelected = selectedStaff?.id === staff.id;
                        const staffTicketsCount = tickets.filter(t => 
                          t.assignedTo === staff.id || 
                          (t.assignedStaffName && staff.name && t.assignedStaffName.toLowerCase().includes(staff.name.toLowerCase()))
                        ).length;

                        return (
                          <div 
                            key={staff.id} 
                            onClick={() => {
                              setSelectedStaff(staff);
                              setShowStaffDropdown(false);
                              setStaffSearchQuery("");
                            }}
                            className={`px-3 py-2 hover:bg-teal-50 cursor-pointer flex items-center space-x-2.5 border-b border-gray-50 last:border-0 transition-colors ${isSelected ? 'bg-teal-50/80 font-bold' : ''}`}
                          >
                            <img src={staff.avatar} alt={staff.name} className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-200" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-gray-900 truncate flex items-center justify-between">
                                <span className="font-semibold">{staff.name}</span>
                                <span className="text-[10px] text-teal-700 bg-teal-100/60 px-1.5 py-0.2 rounded font-bold">
                                  {staffTicketsCount}
                                </span>
                              </div>
                              <div className="text-[10px] text-gray-400 truncate">{staff.role}</div>
                            </div>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0"></span>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:block text-xs font-semibold text-gray-500">
          Total Tiket Laporan: <span className="font-bold text-gray-800">{filteredTickets.length}</span>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex flex-1 min-h-0 overflow-hidden p-3 sm:p-4 gap-4">
        
        {/* KOLOM KIRI: REPORT CATEGORY SIDEBAR */}
        <div className="hidden lg:flex w-56 xl:w-64 flex-col shrink-0 bg-transparent">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-lg">Kategori Laporan</h2>
            {activeCategory && activeCategory !== 'ALL' && (
              <button 
                type="button"
                onClick={() => setActiveCategory('ALL')}
                className="text-[11px] text-teal-600 hover:text-teal-700 font-semibold underline cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-1 text-sm font-semibold text-gray-800 custom-scrollbar">
            {/* Opsi Semua Laporan */}
            <div 
              onClick={() => setActiveCategory('ALL')}
              className={`flex justify-between items-center py-2 px-3 rounded-lg cursor-pointer transition-colors mb-2 ${activeCategory === 'ALL' ? 'bg-teal-500 text-white font-bold shadow-2xs' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <span>Semua Laporan</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === 'ALL' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {tickets.length}
              </span>
            </div>

            {sidebarMenus.map((menu, idx) => {
              const isMenuExpanded = expandedMenu === menu.title;
              return (
                <div key={idx}>
                  <div 
                    onClick={() => setExpandedMenu(isMenuExpanded ? "" : menu.title)}
                    className={`flex justify-between items-center py-2 px-2 rounded-md cursor-pointer transition-colors ${isMenuExpanded ? 'text-teal-600 font-bold bg-teal-50/50' : 'text-gray-700 hover:text-teal-600'}`}
                  >
                    <span className="truncate">{menu.title}</span>
                    <svg className={`w-4 h-4 transition-transform shrink-0 ${isMenuExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {isMenuExpanded && (
                    <div className="ml-2 mt-1 mb-2 space-y-1 border-l-2 border-teal-200 pl-3 text-xs font-medium text-gray-600">
                      {menu.items.map((item, subIdx) => {
                        const isSubActive = activeCategory.toLowerCase() === item.toLowerCase();
                        const countForItem = tickets.filter(t => 
                          (t.category || '').toLowerCase().includes(item.toLowerCase()) || 
                          (t.subcategory || '').toLowerCase().includes(item.toLowerCase()) ||
                          (t.issue || '').toLowerCase().includes(item.toLowerCase())
                        ).length;

                        return (
                          <div 
                            key={subIdx}
                            onClick={() => setActiveCategory(item)} 
                            className={`py-2 px-3 rounded-md cursor-pointer flex items-center justify-between transition-colors ${isSubActive ? 'bg-teal-100 text-teal-800 font-bold' : 'hover:bg-gray-100'}`}
                          >
                            <span className="truncate">{item}</span>
                            {countForItem > 0 && (
                              <span className="text-[10px] bg-white border border-teal-200 text-teal-700 px-1.5 py-0.2 rounded-full font-bold ml-1 shrink-0">
                                {countForItem}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* KOLOM TENGAH: KANBAN BOARD */}
        <div className="flex-1 min-w-0 flex gap-3 sm:gap-4 overflow-x-auto pb-2 custom-scrollbar snap-x snap-mandatory">
          
          {/* UNSOLVED COLUMN */}
          <div className={`w-[85vw] sm:w-[320px] ${selectedTicket ? 'xl:w-[280px] 2xl:w-[320px]' : 'xl:w-auto xl:flex-1'} snap-start flex flex-col border border-gray-300 rounded-xl bg-white shrink-0 shadow-sm overflow-hidden transition-all duration-200`}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight">Unsolved</h3>
                <p className="text-xs text-gray-500 mt-0.5">{unsolvedTickets.length} Laporan</p>
              </div>
              <span className="bg-red-600 text-white text-sm font-bold px-2.5 py-1 rounded-md">{unsolvedTickets.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/50 custom-scrollbar">
              {loading && Array.from({ length: 3 }).map((_, i) => <KanbanCardSkeleton key={i} />)}
              {!loading && unsolvedTickets.length === 0 && (
                <div className="text-center py-12 px-4 text-xs text-gray-400">
                  <p className="font-semibold text-gray-600 mb-1">Tidak ada tiket</p>
                  <p>Belum ada laporan {activeCategory !== 'ALL' ? `kategori "${activeCategory}"` : ''}</p>
                </div>
              )}
              {!loading && unsolvedTickets.map((ticket, idx) => renderKanbanCard(ticket, 'unsolved', idx))}
            </div>
          </div>

          {/* PENDING COLUMN */}
          <div className={`w-[85vw] sm:w-[320px] ${selectedTicket ? 'xl:w-[280px] 2xl:w-[320px]' : 'xl:w-auto xl:flex-1'} snap-start flex flex-col border border-gray-300 rounded-xl bg-white shrink-0 shadow-sm overflow-hidden transition-all duration-200`}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight">Pending</h3>
                <p className="text-xs text-gray-500 mt-0.5">{pendingTickets.length} Tertunda</p>
              </div>
              <span className="bg-orange-500 text-white text-sm font-bold px-2.5 py-1 rounded-md">{pendingTickets.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/50 custom-scrollbar">
              {loading && Array.from({ length: 3 }).map((_, i) => <KanbanCardSkeleton key={i} />)}
              {!loading && pendingTickets.length === 0 && (
                <div className="text-center py-12 px-4 text-xs text-gray-400">
                  <p className="font-semibold text-gray-600 mb-1">Tidak ada tiket</p>
                  <p>Belum ada tiket tertunda {activeCategory !== 'ALL' ? `kategori "${activeCategory}"` : ''}</p>
                </div>
              )}
              {!loading && pendingTickets.map((ticket, idx) => renderKanbanCard(ticket, 'pending', idx))}
            </div>
          </div>

          {/* SOLVED COLUMN */}
          <div className={`w-[85vw] sm:w-[320px] ${selectedTicket ? 'xl:w-[280px] 2xl:w-[320px]' : 'xl:w-auto xl:flex-1'} snap-start flex flex-col border border-gray-300 rounded-xl bg-white shrink-0 shadow-sm overflow-hidden transition-all duration-200`}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight">Solved</h3>
                <p className="text-xs text-gray-500 mt-0.5">{solvedTickets.length} Selesai</p>
              </div>
              <span className="bg-emerald-500 text-white text-sm font-bold px-2.5 py-1 rounded-md">{solvedTickets.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/50 custom-scrollbar">
              {loading && Array.from({ length: 3 }).map((_, i) => <KanbanCardSkeleton key={i} />)}
              {!loading && solvedTickets.length === 0 && (
                <div className="text-center py-12 px-4 text-xs text-gray-400">
                  <p className="font-semibold text-gray-600 mb-1">Tidak ada tiket</p>
                  <p>Belum ada tiket terselesaikan {activeCategory !== 'ALL' ? `kategori "${activeCategory}"` : ''}</p>
                </div>
              )}
              {!loading && solvedTickets.map((ticket, idx) => renderKanbanCard(ticket, 'solved', idx))}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: CHAT & ACTIONS PANEL (ANIMASI SLIDE CARD CHAT) */}
        {selectedTicket && (
          <>
            {/* Backdrop overlay di mobile/tablet */}
            <div 
              onClick={() => setSelectedTicket(null)}
              className="fixed inset-0 bg-black/25 z-40 xl:hidden backdrop-blur-2xs transition-opacity"
            />

            <div 
              key={`detail-panel-${selectedTicket.id}`}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] xl:static xl:z-auto xl:w-[380px] 2xl:w-[420px] h-full border border-gray-300 xl:rounded-xl bg-white flex flex-col shrink-0 shadow-2xl xl:shadow-sm overflow-hidden animate-slide-in-right"
            >
              {/* Detail User Header with Close Button ✕ */}
            <div className="p-4 border-b border-gray-100 flex items-start justify-between gap-2 shrink-0 bg-white shadow-sm z-10">
              <div className="flex items-start space-x-3 min-w-0 flex-1">
                <img src={selectedTicket.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" />
                <div className="flex-1 text-sm min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <span className="font-bold text-gray-900 truncate">{selectedTicket.name}</span>
                      <span className="text-gray-500 text-xs shrink-0">{selectedTicket.role}</span>
                      {selectedTicket.isVip && <span className="bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0">VIP</span>}
                    </div>
                    <span className="text-gray-400 text-xs font-medium shrink-0">{selectedTicket.duration}</span>
                  </div>
                  <p className="text-gray-600 text-xs mt-0.5 font-medium truncate">{selectedTicket.issue}</p>
                  {selectedTicket.targetName && (
                    <div className="mt-1 text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 truncate">
                      Target: <span className="font-bold">{selectedTicket.targetName}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-400 text-xs font-medium">{selectedTicket.id}</span>
                    <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded border border-teal-200 truncate">
                      Assigned to: {selectedTicket.assignedStaffName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tombol Tutup Silang (✕) */}
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors shrink-0 cursor-pointer"
                title="Tutup Detail Laporan"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Stream */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 flex flex-col space-y-4 bg-gray-50/50 custom-scrollbar">
              {selectedTicket.messages.map((msg: any, index: number) => (
                <div key={index} className={`flex items-start space-x-3 w-full ${msg.sender === 'admin' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {msg.sender === 'user' && (
                    <img src={selectedTicket.avatar} alt="User" className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200" />
                  )}
                  <div className={`p-3 shadow-sm text-sm max-w-[80%] xl:max-w-[260px] ${
                    msg.sender === 'admin' 
                      ? 'bg-teal-500 text-white rounded-2xl rounded-tr-none' 
                      : 'bg-white border border-gray-200 rounded-2xl rounded-tl-none text-gray-800'
                  }`}>
                    {msg.sender === 'user' && <h5 className="font-bold text-gray-900 mb-1 text-xs">{selectedTicket.name}</h5>}
                    <p className={`leading-relaxed text-xs ${msg.sender === 'admin' ? 'text-teal-50' : 'text-gray-600'}`}>
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons & Chat Input */}
            <div className="p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-white shrink-0 border-t border-gray-100 space-y-3 relative">
              <div className="flex space-x-2">
                <button onClick={() => handleAction('Agree')} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex-1 transition-colors cursor-pointer">Agree</button>
                <button onClick={() => handleAction('Pending')} className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex-1 transition-colors cursor-pointer">Pending</button>
                <button onClick={() => handleAction('Decline')} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex-1 transition-colors cursor-pointer">Decline</button>
                
                <div className="relative flex">
                  <button 
                    onClick={() => setShowFlagMenu(!showFlagMenu)} 
                    className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" /></svg>
                  </button>

                  {showFlagMenu && (
                    <div className="absolute bottom-full mb-2 right-0 bg-white border border-gray-200 shadow-xl rounded-lg p-2 flex flex-col space-y-1.5 z-20 min-w-[50px]">
                      {[3, 2, 1].map((level) => (
                        <React.Fragment key={level}>
                          <button onClick={() => handleSetPriority(level)} className="flex items-center space-x-2 text-xs font-bold px-2 py-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors w-full cursor-pointer">
                            <svg className={`w-3 h-3 ${level === 3 ? 'text-red-500' : level === 2 ? 'text-orange-500' : 'text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg> 
                            <span>{level}</span>
                          </button>
                          {level > 1 && <div className="border-t border-gray-100 w-full"></div>}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-gray-300 rounded-xl p-3 bg-gray-50 flex flex-col shadow-sm focus-within:ring-1 focus-within:ring-teal-500 transition-shadow">
                <textarea 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tulis balasan... (Tekan Enter untuk kirim)" 
                  className="bg-transparent w-full resize-none text-xs focus:outline-none mb-3 text-gray-700 h-16"
                ></textarea>
                
                <div className="flex justify-end items-center text-gray-500">
                  <button 
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                    className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <span>Kirim</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          </>
        )}

      </div>
    </div>
  );
}

export default function SupervisorReportPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN_SPV', 'SUPERVISOR_ADMIN', 'ADMIN']}>
      <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Memuat papan laporan investigasi...</div>}>
        <SupervisorReportContent />
      </Suspense>
    </RoleGuard>
  );
}
