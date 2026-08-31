// @ts-nocheck
import React, { useState } from 'react';
import { Search, Plus, ThumbsUp, MessageSquare, Award, Tag } from 'lucide-react';

const POSTS = [
  {
    id: 1,
    author: 'Alex Chen',
    avatar: 'A',
    role: 'Senior Backend Engineer',
    title: 'How can we improve API security in microservice architecture?',
    content: 'We are moving to a distributed architecture and I want to ensure our API gateways and service-to-service communication remain secure. What are the best practices you follow here?',
    tags: ['Security', 'Backend', 'Architecture'],
    upvotes: 42,
    comments: 12,
    hasBestAnswer: true,
    time: '2 hours ago'
  },
  {
    id: 2,
    author: 'Sarah Jenkins',
    avatar: 'S',
    role: 'Frontend Lead',
    title: 'State Management: Zustand vs Redux Toolkit for our next major module',
    content: 'I\'ve been evaluating Zustand for our new analytics dashboard instead of our traditional RTK approach. It seems much lighter and requires less boilerplate. Thoughts?',
    tags: ['React', 'Frontend', 'State Management'],
    upvotes: 28,
    comments: 34,
    hasBestAnswer: false,
    time: '5 hours ago'
  }
];

export const KnowledgeHub = () => {
  return (
    <div className="p-8 text-slate-900 max-w-7xl mx-auto flex gap-8">
      <div className="flex-1 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Knowledge Hub</h1>
            <p className="text-slate-600 mt-2">Share insights, ask questions, and learn from peers.</p>
          </div>
          <button className="flex items-center gap-2 bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <Plus size={20} /> Ask Question
          </button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search discussions, tags..." 
              className="w-full bg-white border border-slate-200 rounded-lg py-3 pl-10 pr-4 text-slate-900 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-4 border-b border-slate-200 pb-px">
          {['Recent', 'Most Voted', 'Unanswered', 'My Posts'].map((tab, i) => (
            <button key={tab} className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${i === 0 ? 'border-purple-500 text-purple-600' : 'border-transparent text-slate-600 hover:text-slate-800'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {POSTS.map(post => (
            <div key={post.id} className="bg-white border border-slate-200 p-6 rounded-xl hover:border-slate-300 transition-colors">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                  <button className="text-slate-600 hover:text-purple-600 p-1"><ThumbsUp size={20} /></button>
                  <span className="font-bold text-lg">{post.upvotes}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">{post.avatar}</div>
                    <span className="text-sm font-medium text-slate-800">{post.author}</span>
                    <span className="text-xs text-slate-500">• {post.time}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 hover:text-purple-600 cursor-pointer">{post.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-4">{post.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded">
                          <Tag size={12} /> {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      {post.hasBestAnswer && (
                        <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-medium">
                          <Award size={14} /> Best Answer
                        </span>
                      )}
                      <span className="flex items-center gap-1"><MessageSquare size={16} /> {post.comments} Answers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-80 hidden lg:block space-y-6">
        <div className="bg-white border border-slate-200 p-6 rounded-xl">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Award className="text-amber-600" /> Top Contributors</h3>
          <div className="space-y-4">
            {[
              { name: 'David Kim', score: 890, avatar: 'D' },
              { name: 'Maria Garcia', score: 750, avatar: 'M' },
              { name: 'Alex Chen', score: 620, avatar: 'A' }
            ].map((user, i) => (
              <div key={user.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm">{user.avatar}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.score} points</div>
                </div>
                <div className="text-amber-600 font-bold text-sm">#{i+1}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl">
          <h3 className="font-bold mb-4">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {['React', 'Node.js', 'System Design', 'AWS', 'TypeScript', 'CSS'].map(tag => (
              <span key={tag} className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
