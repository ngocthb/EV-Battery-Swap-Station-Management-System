"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { io } from "socket.io-client";
import { getChatRoomByUserId, sendMessageAPI } from "@/services/chatService";
import { toast } from "react-toastify";
import { formatTimeHCM } from "@/utils/format";
import { User } from "@/types";

interface Chat {
  id: number;
  name: string;
  messages?: Message[];
  time?: string;
  createdBy?: number;
  supporterId?: number;
  supporter?: User;
}

interface Message {
  id: string;
  content: string;
  senderId: number;
  createdAt: string;
}

export default function ChatWidget() {
  const user = useSelector((state: any) => state.auth.user);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [roomId, setRoomId] = useState<number | null>(null);
  const [roomDetail, setRoomDetail] = useState<Chat | null>(null);

  const socketRef = useRef<any>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  // scroll message container down
  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isOpen]);

  console.log("roomid", roomId);

  const handleStartChat = async () => {
    try {
      const res = await getChatRoomByUserId();
      const roomData = res?.data;

      if (!roomData?.id) {
        console.warn("Không tìm thấy roomId!");
        return;
      }

      setRoomId(roomData.id);
      setMessages(roomData.messages || []);
      setRoomDetail(roomData);

      // Kết nối socket
      const socket = io("https://amply.io.vn/chat", {
        transports: ["websocket"],
        withCredentials: true,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Connected:", socket.id);
        socket.emit("joinRoom", { roomId: roomData.id });
      });

      socket.on("receiveMessage", (msg) => {
        console.log("receiveMessage", msg);
        setMessages((prev) => [...prev, msg]);
      });
    } catch (err) {
      console.error("Lỗi khi bắt đầu chat:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast.warning("Vui lòng nhập tin nhắn trước khi gửi.");
      return;
    }
    console.log("send message form", {
      roomId: roomId,
      content: messageText.trim(),
    });
    try {
      const res = await sendMessageAPI({
        roomId: roomId,
        content: messageText.trim(),
      });

      const newMessage = res.data;

      setMessageText("");

      socketRef.current?.emit("receiveMessage", {
        roomId: roomId,
        content: newMessage.content,
        senderId: newMessage.senderId,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (isOpen && !socketRef.current) {
      handleStartChat();
    }

    return () => {
      if (!isOpen && socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        console.log("Socket disconnected");
      }
    };
  }, [isOpen]);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 z-50 group"
      >
        <MessageCircle className="w-6 h-6" />

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
                <h3 className="font-semibold">
                  {roomDetail?.supporterId
                    ? roomDetail?.supporter?.fullName
                    : "Hỗ trợ khách hàng"}
                </h3>
                <p className="text-xs text-blue-100">
                  {roomDetail?.supporterId
                    ? "Hỗ trợ khách hàng"
                    : "Chưa có người hỗ trợ"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-custom"
            ref={messageContainerRef}
          >
            {Array.isArray(messages) &&
              messages.length > 0 &&
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === user?.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`flex flex-col  ${
                      message.senderId === user?.id
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-md px-4 py-2 rounded-2xl relative group ${
                        message.senderId === user?.id
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-900 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm break-words">{message.content}</p>
                    </div>
                    <span
                      className={`text-[10px] opacity-70 ${
                        message.senderId === user?.id
                          ? "text-black mr-[2px]"
                          : "text-gray-500 ml-[2px]"
                      }`}
                    >
                      {formatTimeHCM(message.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
