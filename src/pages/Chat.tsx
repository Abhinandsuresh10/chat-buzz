import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Users, Search, MoreVertical, Phone, Video, Smile, Paperclip, Send, ArrowLeft } from "lucide-react";
import type { User, ChatMessage } from "../types/chat";
import { sidebarAnimations, chatAnimations, pageTransition } from "../animations/chatAnimation";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Lottie from "lottie-react";
import CatLove from '../assets/Lovely cats.json'

function Chat() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserEmail(currentUser.email as string);
      } else {
        console.log("no user found")
      }
    })
    return () => unsubscribe();
  }, []);

  const friends: User[] = [
    { id: 1, name: "Alice Johnson", lastMsg: "See you tomorrow!", status: "online" },
    { id: 2, name: "Bob Smith", lastMsg: "Let's code tonight.", status: "typing" },
    { id: 3, name: "Charlie Brown", lastMsg: "Hey there!", status: "offline" },
    { id: 4, name: "Diana Prince", lastMsg: "Are we meeting today?", status: "online" },
  ];

  const messages: ChatMessage[] = [
    { id: 1, text: "Hey, how are you?", sender: "other", timestamp: new Date(Date.now() - 3600000) },
    { id: 2, text: "I'm good! Working on the project.", sender: "user", timestamp: new Date(Date.now() - 1800000) },
    { id: 3, text: "That's great! How's it going?", sender: "other", timestamp: new Date(Date.now() - 1200000) },
  ];

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'typing': return 'bg-blue-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: User['status']) => {
    switch (status) {
      case 'online': return 'Online';
      case 'typing': return 'Typing...';
      case 'offline': return 'Offline';
      default: return 'Offline';
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setIsMobileChatOpen(true);
  };

  const handleBackToContacts = () => {
    setIsMobileChatOpen(false);
    setSelectedUser(null);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle send message logic here
      setMessage("");
    }
  };

  if (!userEmail) {
    return (
      <motion.div
        className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white"
      >
        <div className="flex flex-col items-center">
          <Lottie
            animationData={CatLove}
            loop={true}
            className="w-48 h-48" // smaller size (192px)
          />
        </div>
      </motion.div>
    )
  }


  return (
    <motion.div
      className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white"
      {...pageTransition}
    >
      {/* Sidebar - Hidden on mobile when chat is open */}
      <motion.aside
        className={`
          w-full md:w-80 bg-gray-800/50 backdrop-blur-lg border-r border-gray-700/50 flex flex-col
          ${isMobileChatOpen ? 'hidden md:flex' : 'flex'}
        `}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with smaller buttons */}

        <div className="p-4 border-b border-gray-700/50">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600/80 hover:bg-blue-500 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
            >
              <Users size={16} />
              <span>Find People</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600/80 hover:bg-green-500 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
            >
              <UserPlus size={16} />
              <span>Requests</span>
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all duration-200 text-sm"
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          <motion.div
            variants={sidebarAnimations.container}
            initial="hidden"
            animate="show"
            className="space-y-1"
          >
            {friends.map((friend) => (
              <motion.div
                key={friend.id}
                variants={sidebarAnimations.item}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedUser?.id === friend.id
                    ? 'bg-blue-600/20 border border-blue-500/50'
                    : 'bg-gray-700/30 hover:bg-gray-700/50 border border-transparent'
                  }`}
                onClick={() => handleUserSelect(friend)}
              >
                <div className="flex items-center gap-3">
                  {/* Profile Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      {friend.name.charAt(0)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-gray-800 ${getStatusColor(friend.status)}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm truncate">{friend.name}</p>
                      <span className="text-xs text-gray-400">
                        {friend.status === 'typing' ? 'Now' : '2h'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className={`text-xs truncate ${friend.status === 'typing' ? 'text-blue-400 font-medium' : 'text-gray-400'
                        }`}>
                        {friend.status === 'typing' ? 'Typing...' : friend.lastMsg}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.aside>

      {/* Chat Area */}
      <main className={`flex-1 flex flex-col ${!isMobileChatOpen ? 'hidden md:flex' : 'flex'}`}>
        <AnimatePresence mode="wait">
          {selectedUser ? (
            <motion.div
              key="chat-active"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="flex-1 flex flex-col"
            >
              {/* Chat Header with back button for mobile */}
              <div className="p-4 bg-gray-800/30 backdrop-blur-lg border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  {/* Back button for mobile */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleBackToContacts}
                    className="md:hidden p-1 hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </motion.button>

                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
                        {selectedUser.name.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-gray-900 ${getStatusColor(selectedUser.status)}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-bold text-base">{selectedUser.name}</h2>
                      <p className={`text-xs ${selectedUser.status === 'online' ? 'text-green-400' :
                          selectedUser.status === 'typing' ? 'text-blue-400' : 'text-gray-400'
                        }`}>
                        {getStatusText(selectedUser.status)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                      <Phone size={18} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                      <Video size={18} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-900/50 to-gray-800/50">
                <motion.div
                  variants={chatAnimations.container}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      variants={chatAnimations.message}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl ${msg.sender === 'user'
                          ? 'bg-blue-600 rounded-br-none'
                          : 'bg-gray-700 rounded-bl-none'
                        }`}>
                        <p className="text-white text-sm">{msg.text}</p>
                        <p className="text-xs opacity-60 mt-1 text-right">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Message Input */}
              <div className="p-4 bg-gray-800/30 backdrop-blur-lg border-t border-gray-700/50">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Paperclip size={18} />
                  </motion.button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-3 py-2 pr-10 rounded-lg bg-gray-700/50 border border-gray-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all duration-200 text-sm"
                    />
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="button" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                      <Smile size={16} />
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors duration-200"
                  >
                    <Send size={16} />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800"
            >
              <div className="text-center space-y-3 p-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-300">Welcome to Messages</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Select a conversation from the sidebar to start chatting with your friends and colleagues.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}

export default Chat;