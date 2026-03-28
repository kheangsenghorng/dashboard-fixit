"use client";

import React, { useState } from "react";
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  CheckCheck,
} from "lucide-react";

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageText, setMessageText] = useState("");

  const contacts = [
    {
      id: 1,
      name: "Alex Johnson",
      lastMsg: "See you at 5!",
      time: "12:45 PM",
      online: true,
      unread: 2,
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    {
      id: 2,
      name: "Sarah Williams",
      lastMsg: "The report is ready.",
      time: "Yesterday",
      online: false,
      unread: 0,
      avatar: "https://i.pravatar.cc/150?u=2",
    },
    {
      id: 3,
      name: "Design Team",
      lastMsg: "New assets uploaded.",
      time: "Monday",
      online: true,
      unread: 0,
      avatar: "https://i.pravatar.cc/150?u=3",
    },
    {
      id: 4,
      name: "Michael Scott",
      lastMsg: "That’s what she said!",
      time: "Dec 20",
      online: false,
      unread: 5,
      avatar: "https://i.pravatar.cc/150?u=4",
    },
  ];

  const messages = [
    {
      id: 1,
      text: "Hey! How is the project going?",
      sender: "them",
      time: "10:00 AM",
    },
    {
      id: 2,
      text: "It's going well. I've finished the UI components.",
      sender: "me",
      time: "10:02 AM",
    },
    {
      id: 3,
      text: "Great! Can we review it this afternoon?",
      sender: "them",
      time: "10:05 AM",
    },
    {
      id: 4,
      text: "Sure, let's meet at 5 PM.",
      sender: "me",
      time: "10:10 AM",
    },
    { id: 5, text: "See you at 5!", sender: "them", time: "12:45 PM" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* SIDEBAR: CONTACTS LIST */}
      <div className="w-full md:w-80 flex flex-col border-r bg-white">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedChat(contact.id)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                selectedChat === contact.id
                  ? "bg-blue-50 border-r-4 border-blue-500"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-400">{contact.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {contact.lastMsg}
                </p>
              </div>
              {contact.unread > 0 && (
                <div className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {contact.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="hidden md:flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={contacts.find((c) => c.id === selectedChat)?.avatar}
              className="w-10 h-10 rounded-full"
              alt="profile"
            />
            <div>
              <h2 className="font-bold text-lg leading-tight">
                {contacts.find((c) => c.id === selectedChat)?.name}
              </h2>
              <span className="text-xs text-green-500 font-medium">Online</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <Phone className="w-5 h-5 cursor-pointer hover:text-blue-500" />
            <Video className="w-5 h-5 cursor-pointer hover:text-blue-500" />
            <MoreVertical className="w-5 h-5 cursor-pointer hover:text-blue-500" />
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f0f2f5]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm relative ${
                  msg.sender === "me"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white text-gray-800 rounded-tl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <div
                  className={`flex items-center justify-end gap-1 mt-1 ${
                    msg.sender === "me" ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  <span className="text-[10px]">{msg.time}</span>
                  {msg.sender === "me" && <CheckCheck className="w-3 h-3" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full">
            <Smile className="text-gray-500 cursor-pointer w-6 h-6 hover:text-blue-500" />
            <Paperclip className="text-gray-500 cursor-pointer w-5 h-5 hover:text-blue-500" />
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-sm"
            />
            <button
              className={`p-2 rounded-full transition-colors ${
                messageText ? "bg-blue-600 text-white" : "text-gray-400"
              }`}
              disabled={!messageText}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
