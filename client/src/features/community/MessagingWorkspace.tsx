import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { chatApi } from '../../api/courses.api';
import { Send, User, ChevronLeft, MessageCircle } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

export const MessagingWorkspace = () => {
  const { user, token } = useAuthStore();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch conversations
    chatApi.getConversations().then(res => setConversations(res.data)).catch(console.error);

    // Init Socket
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token }
    });
    setSocket(newSocket);

    newSocket.on('message:new', (msg) => {
      setMessages(prev => [...prev, msg]);
      // Update conversations preview
      setConversations(prev => prev.map(c => 
        c.id === msg.conversationId 
          ? { ...c, lastMessagePreview: msg.content, lastMessageAt: msg.createdAt }
          : c
      ));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (activeConversation) {
      chatApi.getMessages(activeConversation.id).then(res => setMessages(res.data)).catch(console.error);
      socket?.emit('conversation:join', activeConversation.id);
    }
    return () => {
      if (activeConversation) {
        socket?.emit('conversation:leave', activeConversation.id);
      }
    };
  }, [activeConversation, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !activeConversation || !socket) return;
    
    socket.emit('message:send', {
      conversationId: activeConversation.id,
      content: input
    });
    
    setInput('');
  };

  return (
    <div className="flex h-[80vh] border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm font-sans mt-10">
      
      {/* SIDEBAR */}
      <div className={`${activeConversation ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-1/3 border-r border-slate-100`}>
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-sm font-bold tracking-[0.2em] text-slate-900 uppercase">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No conversations yet.</div>
          ) : (
            conversations.map(conv => {
              const otherUser = user?.role === 'TRAINER' ? conv.learner : conv.trainer;
              const isActive = activeConversation?.id === conv.id;
              
              return (
                <div 
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`p-4 border-b border-slate-50 cursor-pointer transition-colors ${isActive ? 'bg-purple-50' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <User size={20} className="text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-sm text-slate-900 truncate">{otherUser?.name}</h4>
                        <span className="text-[10px] text-slate-400">
                          {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${isActive ? 'text-purple-700' : 'text-slate-500'}`}>
                        {conv.lastMessagePreview || 'Start chatting...'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className={`${!activeConversation ? 'hidden md:flex' : 'flex'} flex-col flex-1 bg-slate-50/50`}>
        {!activeConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <MessageCircle size={48} className="mb-4 text-slate-300" strokeWidth={1} />
            <p className="text-sm tracking-widest uppercase">Select a conversation</p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-4">
              <button onClick={() => setActiveConversation(null)} className="md:hidden text-slate-500">
                <ChevronLeft size={24} />
              </button>
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                <User size={20} className="text-slate-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  {user?.role === 'TRAINER' ? activeConversation.learner?.name : activeConversation.trainer?.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeConversation.relatedCourses?.length > 0 && activeConversation.relatedCourses[0].course?.title}
                </p>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${isMe ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>
                      {msg.content}
                      <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-purple-200' : 'text-slate-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-100 border-none rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white flex items-center justify-center transition-colors shrink-0"
                >
                  <Send size={18} className="ml-1" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
};
