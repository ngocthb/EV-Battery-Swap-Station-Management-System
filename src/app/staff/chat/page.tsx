"use client";

import { StaffLayout } from "@/layout/StaffLayout";
import { Search, ChevronDown, Hash, Smile, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface Chat {
  roomId: string;
  name: string;
  messages?: Message[];
  lastMessage?: string;
  time?: string;
}

interface Message {
  id: string;
  text: string;
  sender: "customer" | "staff";
  time: string;
}

const quickReplies = [
  { id: 1, label: "Bye" },
  { id: 2, label: "Feedback" },
  { id: 3, label: "Goodbye" },
  { id: 4, label: "Help" },
  { id: 5, label: "Product" },
  { id: 6, label: "Delivery" },
  { id: 7, label: "Thank" },
  { id: 8, label: "Transfer" },
  { id: 9, label: "Welcome" },
  { id: 10, label: "Else" },
];

function ChatWithCustomer() {
  const [roomList, setRoomList] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  const socket = io("http://localhost:8080/chat", {
    transports: ["websocket"],
    withCredentials: true,
  });

  useEffect(() => {
    socket.emit("getRooms"); // gửi req đén server yc nhận sự kiện này
    socket.on("rooms-list", (rooms) => {
      // lắng nghe data server trả về
      console.log("Danh sách phòng:", rooms);
      setRoomList(rooms);
    });
  }, []);
  return (
    <StaffLayout>
      <div className="h-full flex bg-gray-50 gap-3">
        {/*Aside menu */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col rounded-xl">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <button className="flex items-center gap-2 text-sm font-medium text-gray-700">
                Sort by: <span className="font-semibold">Newestest</span>
                <ChevronDown size={16} />
              </button>
            </div>
            <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
              <span className="text-lg">+</span> New chat
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            {/*Top */}
            <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center justify-between">
              <span>My chats</span>
              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                {roomList.length}
              </span>
            </div>
            {/*room list */}
            <div className="space-y-1">
              {roomList.map((room) => (
                <div
                  key={room.roomId}
                  onClick={() => setSelectedChat(room)}
                  className={`p-3 bg-gray-100 rounded-lg cursor-pointer transition-colors relative ${
                    selectedChat?.roomId === room.roomId
                      ? "bg-gray-100 border-l-4 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-900 flex items-center gap-1">
                          {room?.roomId}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {room?.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <button className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center justify-between">
              <span>Admin user 2</span>
              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                2
              </span>
            </button>
          </div>
        </div>

        {/*Main chat */}
        <div className="flex-1 flex flex-col">
          {!selectedChat ? (
            <div className="bg-white px-6 py-4 rounded-xl h-full w-full flex items-center justify-center">
              <p>Hãy chọn phòng</p>
            </div>
          ) : (
            <>
              {/*header - user info */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        {selectedChat?.roomId}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <X size={16} /> Stop chat
                  </button>
                </div>
              </div>

              {/*Chat message */}
              <div className="flex-1 overflow-y-auto p-6 bg-white">
                {/*message container */}
                <div className="space-y-4 w-full">
                  {(selectedChat?.messages || []).map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "staff"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-md px-4 py-3 rounded-2xl ${
                          message.sender === "staff"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-900 border border-gray-200"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "staff"
                              ? "text-blue-100"
                              : "text-gray-400"
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}

                  {showQuickReplies && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-2">
                        {quickReplies.map((reply) => (
                          <button
                            key={reply.id}
                            onClick={() => {
                              setMessageText(reply.label);
                              setShowQuickReplies(false);
                            }}
                            className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                          >
                            {reply.id}. {reply.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/*input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-end gap-3">
                    <button
                      onClick={() => setShowQuickReplies(!showQuickReplies)}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Hash size={24} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                      <Smile size={24} />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Start typing..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      <Send size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </StaffLayout>
  );
}

export default ChatWithCustomer;
