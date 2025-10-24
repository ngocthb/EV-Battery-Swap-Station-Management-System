"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, User, Bot } from "lucide-react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { io } from "socket.io-client";

interface Message {
  id: number;
  text: string;
  sender: "user" | "staff";
  timestamp: Date;
}

export default function ChatWidget() {
  const user = useSelector((state: any) => state.auth.user);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Xin chào! Tôi có thể giúp gì cho bạn?",
      sender: "staff",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [hasStart, setHasStart] = useState(false);

  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (hasStart) {
      socketRef.current = io("http://localhost:8080/chat", {
        transports: ["websocket"],
        withCredentials: true,
      });

      const socket = socketRef.current;

      socket.on("connect", () => {
        console.log("connected socket", socket.connected);
        socket.emit("user-join", { userId: user?.id });

        socket.on("joined-room", (room: string) => {
          console.log("room", room);
        });
      });

      return () => {
        socket.disconnect();
        console.log("socket disconnected");
      };
    }
  }, [hasStart]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages([...messages, userMessage]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 z-50 group"
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          1
        </div>
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat với nhân viên
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          {/* Overlay yêu cầu đăng nhập */}
          {!user && (
            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <X
                className="absolute top-4 right-4 cursor-pointer"
                onClick={() => setIsOpen(false)}
              />
              <p className="text-gray-700 text-sm mb-4">
                Vui lòng đăng nhập để sử dụng tính năng chat hỗ trợ.
              </p>
              <Link href="/login">
                <button
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow"
                >
                  Đăng nhập
                </button>
              </Link>
            </div>
          )}

          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold">Hỗ trợ khách hàng</h3>
                <p className="text-xs text-blue-100">Trực tuyến</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* start with btn*/}
          {!hasStart && user && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <p className="text-gray-700 mb-4 text-sm">
                Chào bạn! Nhấn nút bên dưới để bắt đầu trò chuyện với nhân viên
                hỗ trợ.
              </p>
              <button
                onClick={() => setHasStart(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2 rounded-lg shadow transition-all"
              >
                Bắt đầu
              </button>
            </div>
          )}

          {/* Messages Input*/}
          {hasStart && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === "staff" && (
                          <User className="w-4 h-4 mt-1 text-gray-500" />
                        )}
                        <div>
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
