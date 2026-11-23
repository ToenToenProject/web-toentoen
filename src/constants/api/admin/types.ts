export type ChatStatus = 'Unsolved' | 'Process' | 'Done';

export interface Message {
    sender: 'user' | 'admin' | 'system';
    text: string;
    time: string;
    senderName?: string;
}

export interface ChatSession {
    id: string;
    name: string;
    role: string;
    isVip: boolean;
    avatar: string;
    lastTime: string;
    lastMessage: string;
    status: ChatStatus;
    isInactive: boolean;
    ticketTitle: string;
    ticketId: string;
    email: string;
    phone: string;
    accountSince: string;
    subscription: string;
    totalTickets: number;
    messages: Message[];
}