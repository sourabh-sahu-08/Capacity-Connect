import React, { useState } from 'react';
import { Play, CheckCircle, MessageSquare, BookOpen, Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const CoursePlayer = () => {
  const [activeTab, setActiveTab] = useState<'copilot' | 'notes'>('copilot');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'ai', content: 'Hi! I\'m your AI Learning Copilot. I see you are learning about React Hooks. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setIsLoading(true);
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `Great question! In React, \`useEffect\` lets you synchronize a component with an external system. It's often used for data fetching, setting up subscriptions, or manually changing the DOM.` 
      }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-6rem)] -m-8 flex flex-col md:flex-row bg-zinc-950 text-white overflow-hidden">
      
      {/* Left: Course Navigation */}
      <div className="w-full md:w-80 border-r border-zinc-800 bg-zinc-900 overflow-y-auto hidden lg:block">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="font-bold text-lg leading-tight">Advanced React Development</h2>
          <div className="mt-3 bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full" style={{width: '72%'}}></div>
          </div>
          <p className="text-xs text-zinc-400 mt-2">72% Completed</p>
        </div>
        <div className="p-4 space-y-2">
          {['1. Introduction', '2. Understanding Hooks', '3. Advanced State Management', '4. Performance Optimization'].map((mod, i) => (
            <div key={mod} className="space-y-1">
              <div className="font-medium text-sm text-zinc-300 py-2">{mod}</div>
              {i === 1 && (
                <div className="pl-4 space-y-1 border-l border-zinc-800 ml-2">
                  <div className="flex gap-2 items-center text-sm py-2 text-indigo-400 bg-indigo-500/10 px-2 rounded">
                    <Play size={14} /> 2.1 The useEffect Hook
                  </div>
                  <div className="flex gap-2 items-center text-sm py-2 text-zinc-400 hover:text-zinc-200 cursor-pointer px-2">
                    <BookOpen size={14} /> 2.2 Custom Hooks
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center: Video Player */}
      <div className="flex-1 flex flex-col min-w-0 bg-black">
        <div className="flex-1 relative bg-zinc-900 flex items-center justify-center">
          {/* Mock Video Player */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
          <button className="relative z-10 w-20 h-20 bg-indigo-600/90 hover:bg-indigo-600 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-transform hover:scale-105">
            <Play size={32} className="ml-2" />
          </button>
        </div>
        <div className="h-64 bg-zinc-950 p-6 overflow-y-auto border-t border-zinc-800">
          <h1 className="text-2xl font-bold mb-2">2.1 The useEffect Hook</h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
            In this lesson, we explore the fundamental concepts of the useEffect hook in React. We will learn how to manage side effects, perform data fetching, and correctly utilize the dependency array to optimize rendering performance.
          </p>
        </div>
      </div>

      {/* Right: AI Copilot */}
      <div className="w-full md:w-96 border-l border-zinc-800 bg-zinc-900 flex flex-col">
        <div className="flex border-b border-zinc-800">
          <button 
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${activeTab === 'copilot' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
            onClick={() => setActiveTab('copilot')}
          >
            <Sparkles size={16} /> AI Copilot
          </button>
          <button 
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${activeTab === 'notes' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
            onClick={() => setActiveTab('notes')}
          >
            <BookOpen size={16} /> Notes
          </button>
        </div>

        {activeTab === 'copilot' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-zinc-800 text-zinc-200 rounded-bl-none border border-zinc-700'}`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-zinc-950 border-t border-zinc-800 space-y-3">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {['Explain Simply', 'Give Example', 'Generate Quiz'].map(action => (
                  <button key={action} onClick={() => setInput(action)} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs rounded-full whitespace-nowrap text-zinc-300 transition-colors">
                    ✨ {action}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything about the lesson..." 
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl flex items-center justify-center transition-colors shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
