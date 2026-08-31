import React from 'react';
import { Search, Filter, Star, Clock } from 'lucide-react';

const COURSES = [
  { id: 1, title: 'Advanced React Development', instructor: 'Sarah Drasner', duration: '18h', difficulty: 'Advanced', rating: 4.8, img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop' },
  { id: 2, title: 'Node.js Microservices', instructor: 'Stephen Grider', duration: '24h', difficulty: 'Intermediate', rating: 4.9, img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop' },
  { id: 3, title: 'Cloud Infrastructure with AWS', instructor: 'Neal Davis', duration: '32h', difficulty: 'Advanced', rating: 4.7, img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop' },
];

export const LearningHub = () => {
  return (
    <div className="p-8 space-y-8 text-slate-900 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold">Learning Hub</h1>
          <p className="text-slate-600 mt-2">Discover premium courses to build your competencies.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search courses, skills..." 
              className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-slate-900 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-100 transition-colors">
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {['All Categories', 'Technology', 'Leadership', 'Management', 'Data Science', 'Cybersecurity'].map((cat, i) => (
          <button key={cat} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COURSES.map(course => (
          <div key={course.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden group cursor-pointer hover:border-purple-500/50 hover:-translate-y-1 transition-all duration-300">
            <div className="h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${course.img})` }}></div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs px-2 py-1 rounded font-medium ${course.difficulty === 'Advanced' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {course.difficulty}
                </span>
                <span className="flex items-center gap-1 text-sm text-slate-600">
                  <Star className="text-yellow-500 w-4 h-4 fill-yellow-500" /> {course.rating}
                </span>
              </div>
              <h3 className="text-lg font-bold group-hover:text-purple-600 transition-colors line-clamp-2">{course.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{course.instructor}</p>
              
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200 text-sm text-slate-600">
                <span className="flex items-center gap-1"><Clock size={16} /> {course.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
