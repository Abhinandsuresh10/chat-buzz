export interface User {
  id: number;
  name: string;
  lastMsg: string;
  status: 'online' | 'offline' | 'typing';
  profilePic?: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
}