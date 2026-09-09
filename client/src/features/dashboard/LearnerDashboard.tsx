import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ArrowRight, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCompetencyProfile } from '../../api/intelligenceApi';
import { coursesApi, enrollmentsApi, chatApi } from '../../api/courses.api';

export const LearnerDashboard = () => {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || 'LEARNER';
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const [profile, setProfile] = useState<any>(null);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (token) {
      getCompetencyProfile(token).then(setProfile).catch(console.error);
      
      coursesApi.getRecommended().then(res => setRecommended(res.data)).catch(console.error);
      enrollmentsApi.getMyEnrollments().then(res => setEnrollments(res.data)).catch(console.error);
      
      chatApi.getConversations().then(res => {
        const count = res.data.reduce((acc: number, c: any) => {
          return acc + (c.messages?.[0] && !c.messages[0].readAt && c.messages[0].senderId !== user?.id ? 1 : 0);
        }, 0);
        setUnreadCount(count);
      }).catch(console.error);
    }
  }, [token, user]);

  const overallScore = profile ? Math.round(profile.overallScore) : 0;
  
  const activeEnrollment = enrollments.find(e => e.status === 'IN_PROGRESS' || e.status === 'ENROLLED');
  const topRecommendation = recommended[0];

  return (
    <div className="space-y-32 pb-32 pt-10 font-sans selection:bg-purple-500/30">
      
      {/* HERO / CAPABILITY CORE */}
      <section className="relative flex flex-col items-center justify-center min-h-[60vh]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
           <div className="w-[800px] h-[800px] border border-slate-100 rounded-full" />
           <div className="w-[600px] h-[600px] border border-slate-100 rounded-full absolute" />
           <div className="w-[400px] h-[400px] border border-slate-100 rounded-full absolute" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-20 z-10 text-center"
        >
          <h2 className="text-xs font-medium tracking-[0.2em] text-slate-500 uppercase">
            Good Evening, {firstName}
          </h2>
          <h1 className="text-sm font-medium tracking-[0.3em] text-slate-700 uppercase">
            Your capability system is evolving
          </h1>
        </motion.div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="text-[10rem] md:text-[12rem] font-light leading-none tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-slate-900 to-slate-500">
            {overallScore}
          </div>
          <div className="text-sm font-bold tracking-[0.2em] text-purple-600 mt-4 uppercase">
            Capability Score
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {[
            { id: '1', x: '50%', y: '10%', label: 'Active Courses: ' + enrollments.filter(e => e.status !== 'COMPLETED').length },
            { id: '2', x: '80%', y: '50%', label: 'Completed: ' + enrollments.filter(e => e.status === 'COMPLETED').length },
            { id: '3', x: '50%', y: '90%', label: 'Skill Gaps: ' + (profile?.skills?.filter((s:any) => s.score < 80).length || 0) },
            { id: '4', x: '20%', y: '50%', label: 'Unread Msgs: ' + unreadCount },
          ].map(node => (
            <div 
              key={node.id} 
              className="absolute pointer-events-auto flex flex-col items-center gap-2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 hover:scale-110 cursor-crosshair"
              style={{ left: node.x, top: node.y }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className={`w-3 h-3 rounded-full ${hoveredNode === node.id ? 'bg-purple-400 shadow-[0_0_20px_rgba(99,102,241,0.6)]' : 'bg-slate-300'}`} />
              <div className={`text-[10px] tracking-[0.2em] uppercase font-bold transition-colors whitespace-nowrap ${hoveredNode === node.id ? 'text-purple-700' : 'text-slate-500'}`}>
                {node.label}
              </div>
            </div>
          ))}
          <svg className="absolute inset-0 w-full h-full opacity-20" style={{ zIndex: -1 }}>
            <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="80%" y1="50%" x2="50%" y2="50%" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50%" y1="10%" x2="50%" y2="50%" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50%" y1="90%" x2="50%" y2="50%" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>
      </section>

      {/* RECOMMENDED COURSE BASED ON SKILL GAP */}
      {topRecommendation && (
        <section className="mt-20">
          <div className="bg-linear-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-10 flex flex-col md:flex-row items-end justify-between gap-10">
            <div className="space-y-8 flex-1">
              <h3 className="text-xs font-bold tracking-[0.2em] text-violet-600 uppercase flex items-center gap-2">
                <Sparkles size={14} className="text-violet-600" /> Recommended For Your Skill Gaps
              </h3>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 leading-tight">
                {topRecommendation.course.title}
              </h2>
              <p className="text-slate-600 max-w-md text-lg leading-relaxed">
                {topRecommendation.reason} Created by <strong className="text-slate-900">{topRecommendation.course.trainer?.name}</strong>.
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-6">
              <div className="flex gap-2">
                {topRecommendation.matchedSkills.map((s:string) => (
                  <span key={s} className="text-xs font-medium px-2 py-1 bg-white border border-violet-200 text-violet-700 rounded-full">{s}</span>
                ))}
              </div>
              <button onClick={() => navigate(`/courses/${topRecommendation.course.id}`)} className="group flex items-center gap-4 bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:bg-purple-700 text-white px-8 py-4 rounded-full transition-all shadow-sm">
                <span className="text-sm font-bold tracking-widest uppercase">View Course</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CURRENT LEARNING */}
      {activeEnrollment && (
        <section className="border-t border-slate-100 pt-20">
          <h3 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-8">
            Continue Learning
          </h3>
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <BookOpen size={24} />
            </div>
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold text-slate-800">{activeEnrollment.course.title}</h4>
                <span className="text-sm font-bold text-slate-500">{Math.round(activeEnrollment.progress)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${activeEnrollment.progress}%` }}
                />
              </div>
            </div>
            <button onClick={() => navigate(`/courses/${activeEnrollment.course.id}`)} className="shrink-0 px-6 py-3 bg-slate-900 text-white rounded-full font-bold text-sm tracking-widest uppercase hover:bg-slate-800 transition-colors">
              Resume
            </button>
          </div>
        </section>
      )}

      {/* MY LEARNING GRID */}
      {enrollments.length > 0 && (
        <section className="border-t border-slate-100 pt-20">
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
              All Enrollments
            </h3>
            <button onClick={() => navigate('/learning-hub')} className="text-sm font-bold tracking-widest text-purple-600 hover:text-purple-800 uppercase flex items-center gap-1">
              Explore More <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((e: any) => (
              <div key={e.id} className="flex flex-col bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg text-slate-800">{e.course.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${e.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {e.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-6">Trainer: {e.course.trainer?.name}</p>
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-800 h-full rounded-full" style={{ width: `${e.progress}%` }} />
                    </div>
                  </div>
                  <button onClick={() => navigate(`/courses/${e.course.id}`)} className="text-sm font-bold text-slate-900 uppercase">
                    {e.status === 'COMPLETED' ? 'Review' : 'Continue'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
