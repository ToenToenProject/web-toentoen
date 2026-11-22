"use client";

import { useState } from "react";
import {
  CS_CHATS_LIST,
  CS_TICKETS_LIST,
} from "@/constants/customerService";
import { CustomerServiceSidebar } from "./CustomerServiceSidebar";
import { CustomerServiceStatsBar } from "./CustomerServiceStatsBar";
import { CSListView } from "./CSListView";
import { LiveChatView } from "./LiveChatView";

type View = "chats-list" | "chat-detail" | "tickets-list";

export const CustomerServiceWorkspace = () => {
  const [view, setView] = useState<View>("chats-list");
  const [selectedChatIdx, setSelectedChatIdx] = useState<number>(3);
  const [selectedTicketIdx, setSelectedTicketIdx] = useState<number>(3);
  // Mobile: sidebar filter bisa dibuka/tutup
  const [showMenu, setShowMenu] = useState(false);

  const statsMode = view === "tickets-list" ? "tickets" : "chats";

  return (
    <div className="flex flex-1 flex-col md:flex-row bg-white min-w-0">
      <div className="w-full md:w-[200px] flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-200">
        <button
          type="button"
          onClick={() => setShowMenu((v) => !v)}
          className="md:hidden flex w-full items-center justify-between px-4 py-3 text-sm font-bold text-gray-800"
          aria-expanded={showMenu}
        >
          <span>Filter &amp; Menu</span>
          <svg className={`h-4 w-4 transition-transform ${showMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" /></svg>
        </button>
        <div className={`${showMenu ? 'block' : 'hidden'} md:block`}>
          <CustomerServiceSidebar
            onSelectLiveChat={() => { setView("chats-list"); setShowMenu(false); }}
            onSelectTickets={() => { setView("tickets-list"); setShowMenu(false); }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <CustomerServiceStatsBar mode={statsMode} />

        {view === "chats-list" && (
          <CSListView
            title={`Live chats List ( 80 )`}
            items={CS_CHATS_LIST}
            selectedIndex={selectedChatIdx}
            onSelectItem={(_item, idx) => {
              setSelectedChatIdx(idx);
              setView("chat-detail");
            }}
          />
        )}

        {view === "tickets-list" && (
          <CSListView
            title={`Tickets List ( 80 )`}
            items={CS_TICKETS_LIST}
            selectedIndex={selectedTicketIdx}
            onSelectItem={(_item, idx) => setSelectedTicketIdx(idx)}
          />
        )}

        {view === "chat-detail" && (
          <LiveChatView onBack={() => setView("chats-list")} />
        )}
      </div>
    </div>
  );
};
