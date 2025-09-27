import { useState } from "react";
import { UserPlus, Users } from "lucide-react";

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);

  const friends = [
    { id: 1, name: "Alice", lastMsg: "See you tomorrow!" },
    { id: 2, name: "Bob", lastMsg: "Let’s code tonight." },
    { id: 3, name: "Charlie", lastMsg: "Typing..." },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4 flex flex-col">
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full p-2 rounded bg-gray-700 mb-4 outline-none"
        />

        <div className="flex-1 overflow-y-auto space-y-2">
          {friends.map((f) => (
            <div
              key={f.id}
              className={`p-3 rounded cursor-pointer ${
                selectedUser?.id === f.id ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => setSelectedUser(f)}
            >
              <p className="font-semibold">{f.name}</p>
              <p className="text-sm text-gray-400 truncate">{f.lastMsg}</p>
            </div>
          ))}
        </div>

        {/* Bottom buttons */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 flex items-center gap-2 bg-blue-600 px-3 py-2 rounded hover:bg-blue-500">
            <Users size={18} /> Find People
          </button>
          <button className="flex-1 flex items-center gap-2 bg-green-600 px-3 py-2 rounded hover:bg-green-500">
            <UserPlus size={18} /> Requests
          </button>
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-4 bg-gray-800 border-b border-gray-700">
              <h2 className="font-bold">{selectedUser.name}</h2>
              <p className="text-sm text-gray-400">Online</p>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              <div className="self-start bg-gray-700 p-3 rounded max-w-xs">
                Hey, how are you?
              </div>
              <div className="self-end bg-blue-600 p-3 rounded max-w-xs">
                I’m good! Working on the project.
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-3 rounded bg-gray-700 outline-none"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </main>
    </div>
  );
}

export default Chat;
