

export interface UserDetails {
  id: string ;
  name: string;
  email: string;
  phone: number;
  status: 'online' | 'offline' | 'typing';
  profileImage?: string;
  lastMsg?: string;
  lastMsgTime?: Date;
}

export interface ChatMessage {
  id: string;
  text: string;
  type: string;
  senderId: string;    
  receiverId: string;    
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}