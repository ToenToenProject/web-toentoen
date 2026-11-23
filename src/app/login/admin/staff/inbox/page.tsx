"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ChatSession, Message, ChatStatus } from '@/constants/api/admin/types';
import { ChatListPanel } from '@/components/admin/inbox/ChatListPanel';
import { MainChatArea } from '@/components/admin/inbox/MainChatArea';
import { adminService } from '@/services/adminService';
import { RoleGuard } from '@/components/auth/RoleGuard';

// Map API status to UI labels and styling
const mapStatusToUI = (apiStatus: string): ChatStatus => {
  const status = apiStatus?.toLowerCase() || '';
  if (status.includes('queue') || status.includes('open') || status.includes('unsolved')) return 'Unsolved';
  if (status.includes('progress') || status.includes('process') || status.includes('pending')) return 'Process';
  if (status.includes('done') || status.includes('resolved') || status.includes('closed')) return 'Done';
  return 'Unsolved'; 
};

function InboxPageContent() {
  const [chatList, setChatList] = useState<ChatSession[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
  
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
    const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

    const fetchTickets = useCallback(async () => {
    try {
      setIsLoadingList(true);
      const res = await adminService.getTickets().catch(() => null);
      
      const ticketsArray = res?.tickets || []; 

      const mappedList: ChatSession[] = ticketsArray.map((item: any) => {
        const rawAvatar = item.customer?.avatar || item.requester?.avatar_url;
        const custAvatar = (rawAvatar && !rawAvatar.includes('unsplash.com') && !rawAvatar.includes('pravatar.cc'))
          ? rawAvatar
          : "/assets/avatars/starter-photo-profile.jpg";

        return {
          id: item.id || item.ticket_id || `TKT-${Math.random()}`,
          name: item.customer?.name || item.requester?.name || "Customer",
          role: item.customer?.tier || item.requester?.role || "User",
          isVip: item.priority === "VIP" || item.requester?.is_vip || false,
          avatar: custAvatar,
          lastTime: item.updatedAt ? new Date(item.updatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : (item.date || "00:00"),
          lastMessage: item.lastMessage || item.last_message || item.subject || "No message",
          status: mapStatusToUI(item.status),
          isInactive: false,
          ticketTitle: item.subject || "Ticket Issue",
          ticketId: item.id ? (item.id.startsWith('#') ? item.id : `#${item.id}`) : `#TK-${item.ticket_id}`,
          email: item.customer?.email || item.requester?.email || "",
          phone: item.customer?.phone || item.requester?.phone || "",
          accountSince: "-",
          subscription: item.priority || "Standard",
          totalTickets: 1,
          messages: []
        };
      });

      setChatList(mappedList);
      if (mappedList.length > 0 && !selectedChatId) {
        setSelectedChatId(mappedList[0].id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingList(false);
    }
  }, [selectedChatId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Parallel retrieval of ticket details and customer profile
  useEffect(() => {
    const fetchTicketDetail = async () => {
      if (!selectedChatId) return;
      try {
        setIsLoadingDetail(true);
        const baseChatItem = chatList.find(c => c.id === selectedChatId);

                const [messagesRes, customerRes] = await Promise.allSettled([
          adminService.getTicketMessages(selectedChatId),
          baseChatItem?.email ? adminService.getCustomerProfile(selectedChatId).catch(() => null) : Promise.resolve(null),
        ]);

        const messagesData: any = messagesRes.status === "fulfilled" ? messagesRes.value : null;
        const customerData: any = customerRes.status === "fulfilled" ? customerRes.value : null;

        let mappedMessages: Message[] = [];

        if (messagesData?.messages && Array.isArray(messagesData.messages) && messagesData.messages.length > 0) {
          mappedMessages = messagesData.messages.map((m: any) => {
            const isSystem = m.sender === 'SYSTEM' || m.sender_type === 'SYSTEM' || m.is_auto_reply;
            const isAdmin = m.sender?.toLowerCase() === 'agent' || m.sender?.toLowerCase() === 'admin' || m.sender_type === 'AGENT';
            return {
              sender: isSystem ? 'system' : (isAdmin ? 'admin' : 'user'),
              text: m.message || m.text || "",
              time: m.timestamp || (m.createdAt ? new Date(m.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : "00:00"),
              senderName: m.senderName || m.sender_name,
            };
          });
        } else {
                    mappedMessages = [
            {
              sender: 'user',
              text: baseChatItem?.ticketTitle || "Halo, saya membutuhkan bantuan terkait pesanan.",
              time: baseChatItem?.lastTime || "00:00",
            }
          ];
          if (baseChatItem?.lastMessage && baseChatItem.lastMessage !== baseChatItem.ticketTitle) {
            mappedMessages.push({
              sender: 'admin',
              text: baseChatItem.lastMessage,
              time: baseChatItem.lastTime || "00:00",
            });
          }
        }

        const custProfile = customerData?.profile;
        const custHistory = customerData?.history;

        const currentSession: ChatSession = {
          id: selectedChatId,
          name: custProfile?.name || baseChatItem?.name || "Customer",
          role: custProfile?.tier || baseChatItem?.role || "User",
          isVip: baseChatItem?.isVip ?? (custProfile?.tier?.includes("VIP") ?? false),
          avatar: (baseChatItem?.avatar && !baseChatItem.avatar.includes('unsplash.com') && !baseChatItem.avatar.includes('pravatar.cc'))
            ? baseChatItem.avatar
            : "/assets/avatars/starter-photo-profile.jpg",
          lastTime: baseChatItem?.lastTime || "00:00",
          lastMessage: baseChatItem?.lastMessage || "No message",
          status: baseChatItem?.status || 'Unsolved',
          isInactive: false,
          ticketTitle: baseChatItem?.ticketTitle || "Ticket Issue",
          ticketId: baseChatItem?.ticketId || `#TK-${selectedChatId}`,
          email: custProfile?.email || baseChatItem?.email || "-",
          phone: custProfile?.phone || baseChatItem?.phone || "-",
          accountSince: custProfile?.registeredAt || "-",
          subscription: custProfile?.tier || baseChatItem?.subscription || "Standard",
          totalTickets: custHistory?.totalTickets ?? baseChatItem?.totalTickets ?? 1,
          messages: mappedMessages,
        };

        setActiveChat(currentSession);

      } catch (error) {
        console.error("Gagal mengambil detail tiket", error);
      } finally {
        setIsLoadingDetail(false);
      }
    };

    fetchTicketDetail();
  }, [selectedChatId]);

    const handleUpdateStatus = async () => {
    if (!activeChat || isUpdatingStatus) return;
    const nextStatusAPI = activeChat.status === 'Done' ? 'QUEUE' : (activeChat.status === 'Process' ? 'SOLVED' : 'IN_PROGRESS');
    
    try {
      setIsUpdatingStatus(true);
      await adminService.updateTicketStatus(activeChat.id, nextStatusAPI);
      await fetchTickets(); 
    } catch (error: any) {
      console.error(error);
      alert(`Gagal memperbarui status tiket: ${error.message || 'Error server'}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!activeChat) return;

    const newMessage: Message = {
      sender: 'admin',
      text: text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setActiveChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage]
    } : prev);

    try {
      await adminService.sendTicketMessage(activeChat.id, text);
    } catch (error: any) {
      console.error("Send Message Error:", error);
      alert(`Pesan gagal dikirim ke server: ${error.message}`);
    }
  };

  return (
    <div className="flex h-full min-h-0 bg-white font-sans overflow-hidden">
      <div className={`${mobileView === 'chat' ? 'hidden md:flex' : 'flex'} w-full md:w-auto h-full shrink-0`}>
        <ChatListPanel 
          chatList={chatList} 
          isLoadingList={isLoadingList} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          selectedChatId={selectedChatId} 
          setSelectedChatId={(id) => { setSelectedChatId(id); setMobileView('chat'); }} 
        />
      </div>

      <div className={`${mobileView === 'list' ? 'hidden md:flex' : 'flex'} flex-1 min-w-0 h-full`}>

      {/* Selalu render MainChatArea jika sudah ada data — transisi smooth ala WhatsApp */}
      {activeChat ? (
        <MainChatArea 
          activeChat={activeChat} 
          isLoadingDetail={isLoadingDetail}
          isUpdatingStatus={isUpdatingStatus} 
          onUpdateStatus={handleUpdateStatus} 
          onSendMessage={handleSendMessage}
          onBack={() => setMobileView('list')}
        />
      ) : isLoadingDetail ? (
                <section className="flex-1 flex flex-col bg-gray-50/50">
          <div className="m-4 h-16 bg-gray-200 rounded-xl animate-pulse" />
          <div className="flex-1 px-6 py-4 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`h-14 rounded-2xl bg-gray-200 animate-pulse ${i % 2 === 0 ? 'w-2/3' : 'w-1/2'}`} />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="flex-1 flex items-center justify-center bg-gray-50/50 text-gray-400 text-sm">
          Pilih percakapan untuk memulai
        </section>
      )}
      </div>
    </div>
  );
}

export default function InboxPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'ADMIN_SPV', 'SUPERVISOR_ADMIN', 'STAFF']}>
      <InboxPageContent />
    </RoleGuard>
  );
}
