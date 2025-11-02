import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Paperclip, Image, FileVideo, FileText, Smile, Send, StopCircle, Mic } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";


interface ChatInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSend: (e: React.FormEvent) => void;
  handleFileUpload?: (file: File, type: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  handleSend,
  handleFileUpload,
}) => {
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const fileInputRefs = {
    image: useRef<HTMLInputElement>(null),
    video: useRef<HTMLInputElement>(null),
    pdf: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const picker = document.querySelector(".picker-area");
      if (picker && !picker.contains(e.target as Node)) {
        setShowEmojiPicker(false);
        setShowFileOptions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleFileClick = (type: keyof typeof fileInputRefs) => {
    fileInputRefs[type].current?.click();
    setShowFileOptions(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];

    if (file && handleFileUpload) handleFileUpload(file, type);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handeKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as any);
      setMessage("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const mimeType =
          MediaRecorder.isTypeSupported("audio/webm")
            ? "audio/webm"
            : MediaRecorder.isTypeSupported("audio/mp4")
              ? "audio/mp4"
              : "audio/mpeg";

        const blob = new Blob(chunks, { type: mimeType });
        setAudioBlob(blob);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Mic access denied:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const sendVoiceMessage = () => {
    if (audioBlob && handleFileUpload) {
      const audioFile = new File([audioBlob], `voice_${Date.now()}.mp3`, {
        type: "audio/mp3",
      });
      handleFileUpload(audioFile, "audio");
      setAudioBlob(null);
    }
  };

  return (
    <div className="relative flex items-center gap-2 w-full bg-gray-800/40 border-t border-gray-700/50 p-3 picker-area">
      {/* 📎 File picker */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          setShowFileOptions((prev) => !prev);
          setShowEmojiPicker(false);
        }}
        className="text-gray-400 hover:text-white transition-colors relative"
        type="button"
      >
        <Paperclip size={18} />
      </motion.button>

      {/* File options popup */}
      {showFileOptions && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="absolute mb-6 ml-2 bottom-12 left-0 bg-gray-800 border border-gray-700 text-white p-2 rounded-lg shadow-lg flex flex-col gap-2 file-picker-popup z-50"
        >
          <button
            onClick={() => handleFileClick("image")}
            className="flex items-center gap-2 hover:bg-gray-600 px-3 py-1 rounded-md text-sm"
          >
            <Image size={16} /> Photo
          </button>
          <button
            onClick={() => handleFileClick("video")}
            className="flex items-center gap-2 hover:bg-gray-600 px-3 py-1 rounded-md text-sm"
          >
            <FileVideo size={16} /> Video
          </button>
          <button
            onClick={() => handleFileClick("pdf")}
            className="flex items-center gap-2 hover:bg-gray-600 px-3 py-1 rounded-md text-sm"
          >
            <FileText size={16} /> PDF
          </button>
        </motion.div>
      )}

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRefs.image}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, "image")}
      />
      <input
        type="file"
        ref={fileInputRefs.video}
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, "video")}
      />
      <input
        type="file"
        ref={fileInputRefs.pdf}
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFileChange(e, "pdf")}
      />


      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={isRecording ? stopRecording : startRecording}
        className={`${isRecording ? "text-red-500" : "text-gray-400 hover:text-white"
          } transition-colors`}
      >
        {isRecording ? <StopCircle size={20} /> : <Mic size={18} />}
      </motion.button>

      {/* Show recorded voice preview */}
      {audioBlob && (
        <div className="flex items-center gap-2 bg-gray-700/40 px-3 py-2 rounded-lg">
          <audio src={URL.createObjectURL(audioBlob)} controls className="h-8" />
          <button
            onClick={sendVoiceMessage}
            className="bg-blue-600 px-3 py-1 rounded-md text-xs hover:bg-blue-500"
          >
            Send
          </button>
          <button
            onClick={() => setAudioBlob(null)}
            className="bg-red-600 px-3 py-1 rounded-md text-xs hover:bg-red-500"
          >
            Cancel
          </button>
        </div>
      )}

      <textarea
        value={message}
        onKeyDown={handeKeyDown}
        onChange={async (e) => {
          setMessage(e.target.value);

          const currentUser = auth.currentUser;
          if (!currentUser) return;

          const userRef = doc(db, "users", currentUser.uid);

          // When user starts typing
          await updateDoc(userRef, { status: "typing" });

          // Reset to online after 3s of no typing
          clearTimeout((window as any).typingTimeout);
          (window as any).typingTimeout = setTimeout(async () => {
            await updateDoc(userRef, { status: "online" });
          }, 1000);
        }}
        placeholder="Type your message..."
        rows={1}
        className="w-full px-3 py-2 pr-10 rounded-lg bg-gray-700/50 border border-gray-600/50
             focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm outline-none
             resize-none overflow-hidden max-h-32 leading-relaxed text-white"
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto";
          target.style.height = `${target.scrollHeight}px`;
        }}
      />


      {/* 😀 Emoji picker button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        type="button"
        className="text-gray-400 hover:text-white transition-colors relative"
        onClick={(e) => {
          e.stopPropagation();
          setShowEmojiPicker((prev) => !prev);
          setShowFileOptions(false);
        }}
      >
        <Smile size={18} />
      </motion.button>

      {showEmojiPicker && (
        <div
          className="absolute mr-4 mb-4 bottom-12 right-0 z-50 transform translate-x-0 md:translate-x-0 
               w-[90vw] max-w-[320px] sm:max-w-[260px] md:max-w-[300px] 
               overflow-hidden rounded-xl shadow-lg bg-white"
        >
          <div className="scale-95 sm:scale-100 origin-bottom-right">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              lazyLoadEmojis={true}
              style={{
                width: "100%",
                background: "transparent",
              }}
            />
          </div>
        </div>
      )}

      {/* ➤ Send button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        onClick={handleSend}
        className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors duration-200"
      >
        <Send size={16} />
      </motion.button>
    </div>
  );
};

export default ChatInput;
