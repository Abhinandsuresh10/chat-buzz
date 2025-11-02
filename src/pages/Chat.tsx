import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Search, MoreVertical, Phone, Video, ArrowLeft, User
} from "lucide-react";
import type { UserDetails, ChatMessage } from "../types/chat";
import { sidebarAnimations, chatAnimations, pageTransition } from "../animations/chatAnimation";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Lottie from "lottie-react";
import CatLove from '../assets/Lovely cats.json';
import { Link } from "react-router-dom";
import onlineStatus from '../assets/Wave animation.json';
import {
  addDoc, collection, doc, getDocs, onSnapshot,
  orderBy, query, serverTimestamp
} from "firebase/firestore";
import ChatInput from "../components/chatInput";

function Chat() {
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [message, setMessage] = useState("");
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [isUserNearBottom, setIsUserNearBottom] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  // Realtime user status listener (merged from UserStatus)
  const [liveStatus, setLiveStatus] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!selectedUser?.id) return;

    const userRef = doc(db, "users", selectedUser.id);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLiveStatus((prev) => ({
          ...prev,
          [selectedUser.id]: data.status || "offline",
        }));
      }
    });

    return () => unsubscribe();
  }, [selectedUser]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UserDetails[];

        setUsers(userList.filter((u) => u.email !== userEmail));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    if (userEmail) fetchUsers();
  }, [userEmail]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUserEmail(currentUser.email as string);
      else console.log("no user found");
    });
    return () => unsubscribe();
  }, []);

  const getChatId = (uid1: string, uid2: string) => {
    return [uid1, uid2].sort().join("_");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser || !userEmail) return;

    const chatId = getChatId(userEmail, selectedUser.email);
    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: userEmail,
      receiverId: selectedUser.email,
      text: message,
      status: "sent",
      type: 'text',
      timestamp: serverTimestamp(),
    });
    setMessage("");
  };

  useEffect(() => {
    if (!selectedUser || !userEmail) return;
    const chatId = getChatId(userEmail, selectedUser.email);
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate
            ? data.timestamp.toDate()
            : new Date(),
        } as ChatMessage;
      });
      setMessages(newMessages);
    });
    return () => unsubscribe();
  }, [selectedUser, userEmail]);


  const scrollToBottom = (instant = false) => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: instant ? "auto" : "smooth" });
  };


  const checkIfUserNearBottom = () => {
    const c = messagesContainerRef.current;
    if (!c) return true;
    const threshold = 120;
    return c.scrollHeight - (c.scrollTop + c.clientHeight) <= threshold;
  };

  useEffect(() => {
    const c = messagesContainerRef.current;
    if (!c) return;

    const onScroll = () => {
      setIsUserNearBottom(checkIfUserNearBottom());
    };

    c.addEventListener("scroll", onScroll, { passive: true });
    setIsUserNearBottom(checkIfUserNearBottom());

    return () => c.removeEventListener("scroll", onScroll);
  }, [selectedUser]);


  useEffect(() => {
    if (isUserNearBottom) {
      requestAnimationFrame(() => scrollToBottom(false));
    }
  }, [messages, isUserNearBottom]);

  useEffect(() => {
    if (!selectedUser) return;
    const t = setTimeout(() => {
      scrollToBottom(true);
    }, 150);

    return () => clearTimeout(t);
  }, [selectedUser]);


  const handleUserSelect = (user: UserDetails) => {
    setSelectedUser(user);
    setIsMobileChatOpen(true);
  };

  const handleBackToContacts = () => {
    setIsMobileChatOpen(false);
    setSelectedUser(null);
  };

  const handleFileUpload = async (file: File, fileType: string) => {
    if (!selectedUser || !userEmail) return;


    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chatbuzz");
    formData.append("folder", "chatBuzz");

    let uploadUrl = "";
    if (fileType === "image") {
      uploadUrl = import.meta.env.VITE_CLOUDINARY;
    } else if (fileType === "video") {
      uploadUrl = import.meta.env.VITE_CLOUDINARY_VIDEO;
    } else if (fileType === "pdf") {
      formData.append("folder", "chatBuzz/files")
      uploadUrl = import.meta.env.VITE_CLOUDINARY_FILE;
    }

    try {
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      const chatId = getChatId(userEmail, selectedUser.email);

      await addDoc(collection(db, "chats", chatId, "messages"), {
        senderId: userEmail,
        receiverId: selectedUser.email,
        type: fileType,
        text: data.secure_url,
        timestamp: serverTimestamp(),
        status: "sent",
      });
    } catch (err) {
      console.error("File upload failed:", err);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `chatbuzz_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();

      // cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };



  if (!userEmail) {
    return (
      <motion.div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="flex flex-col items-center">
          <Lottie animationData={CatLove} loop={true} className="w-48 h-48" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden"
      {...pageTransition}
    >
      {/* Sidebar */}
      <motion.aside
        className={`w-full md:w-80 bg-gray-800/50 backdrop-blur-lg border-r border-gray-700/50 flex flex-col ${isMobileChatOpen ? "hidden md:flex" : "flex"
          }`}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-3 border-b border-gray-700/50">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-purple-600/80 hover:bg-purple-500 px-2.5 py-1.5 rounded-md text-xs"
            >
              <User size={14} />
              <span><Link to="/profile">Profile</Link></span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gray-700/70 hover:bg-gray-600 rounded-md"
            >
              <MoreVertical size={16} />
            </motion.button>
          </div>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          <motion.div
            variants={sidebarAnimations.container}
            initial="hidden"
            animate="show"
            className="space-y-1"
          >
            {users.map((user) => (
              <motion.div
                key={user.id}
                variants={sidebarAnimations.item}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleUserSelect(user)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${selectedUser?.id === user.id
                  ? "bg-blue-600/20 border border-blue-500/50"
                  : "bg-gray-700/30 hover:bg-gray-700/50"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-700"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{user.name}</p>
                    <p
                      className={`text-xs truncate ${user.status === "typing"
                        ? "text-blue-400 font-medium"
                        : "text-gray-400"
                        }`}
                    >
                      {user.status === "typing" ? "Typing..." : user.lastMsg}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.aside>

      {/* Chat Area */}
      <main className={`flex flex-col flex-1 h-full min-h-0 ${!isMobileChatOpen ? "hidden md:flex" : "flex"}`}>
        <AnimatePresence mode="wait">
          {selectedUser ? (
            <motion.div
              key="chat-active"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="flex flex-col flex-1 h-full"
            >
              {/* Header */}
              <div className="p-4 bg-gray-800/30 backdrop-blur-lg border-b border-gray-700/50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleBackToContacts}
                    className="md:hidden p-1 hover:bg-gray-700/50 rounded-lg"
                  >
                    <ArrowLeft size={20} />
                  </motion.button>

                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      {selectedUser.profileImage ? (
                        <img
                          src={selectedUser.profileImage}
                          alt={selectedUser.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-700"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
                          {selectedUser.name.charAt(0)}
                        </div>
                      )}
                      <Lottie
                        animationData={onlineStatus}
                        className={
                          liveStatus[selectedUser.id] !== "offline"
                            ? "absolute -bottom-1 -right-1 w-4 h-4"
                            : "hidden"
                        }
                        loop={true}
                      />
                    </div>

                    <div className="flex-1">
                      <h2 className="font-bold text-base">{selectedUser.name}</h2>
                      <p
                        className={`text-xs ${liveStatus[selectedUser.id] === "online"
                            ? "text-green-400"
                            : liveStatus[selectedUser.id] === "typing"
                              ? "text-blue-400"
                              : "text-gray-400"
                          }`}
                      >
                        {liveStatus[selectedUser.id] === "online"
                          ? "Online"
                          : liveStatus[selectedUser.id] === "typing"
                            ? "Typing..."
                            : "Offline"}
                      </p>

                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-gray-700/50 rounded-lg">
                      <Phone size={18} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-gray-700/50 rounded-lg">
                      <Video size={18} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-gray-700/50 rounded-lg">
                      <MoreVertical size={18} />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-900/50 to-gray-800/50">
                <motion.div
                  variants={chatAnimations.container}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`flex ${msg.senderId === userEmail ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl ${msg.senderId === userEmail
                          ? "bg-blue-600 rounded-br-none"
                          : "bg-gray-700 rounded-bl-none"
                          }`}
                      >
                        {msg.type === "text" && (
                          <p className="text-white text-sm break-words whitespace-pre-wrap overflow-hidden">
                            {msg.text}
                          </p>
                        )}

                        {msg.type === "image" && (
                          <img
                            src={msg.text}
                            alt="sent image"
                            className="rounded-lg max-w-[220px] sm:max-w-[280px] md:max-w-[320px] shadow-md"
                            onClick={() => setFullscreenImage(msg.text)}
                          />
                        )}

                        {msg.type === "video" && (
                          <video
                            controls
                            className="rounded-lg max-w-[220px] sm:max-w-[280px] md:max-w-[320px] shadow-md"
                          >
                            <source src={msg.text} type="video/mp4" />
                          </video>
                        )}

                        {msg.type === "pdf" && (
                          <a
                            href={msg.text}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-300 underline text-sm"
                          >
                            📄 View PDF
                          </a>
                        )}

                        <p className="text-xs opacity-60 mt-1 text-right">
                          {msg.timestamp
                            ? msg.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                            : ""}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {fullscreenImage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                      <motion.img
                        src={fullscreenImage}
                        alt="Full screen"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
                      />
                      <button
                        onClick={() => setFullscreenImage(null)}
                        className="absolute top-4 right-4 text-white text-3xl font-bold"
                      >
                        x
                      </button>
                      <button
                        onClick={() => handleDownload(fullscreenImage)}
                        className="absolute bottom-6 right-6 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm text-sm font-medium"
                      >
                        ⬇ Download
                      </button>

                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </motion.div>
              </div>


              <ChatInput
                message={message}
                setMessage={setMessage}
                handleSend={handleSendMessage}
                handleFileUpload={handleFileUpload}
              />

              {/* </div> */}
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
                  Select a conversation from the sidebar to start chatting with your friends.
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
