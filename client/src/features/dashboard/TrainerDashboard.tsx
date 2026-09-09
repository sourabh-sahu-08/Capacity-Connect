import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, AlertTriangle, ChevronRight, MessageCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getCourses, getLearners, getConversations } from '../../api/trainerApi';
import { useNavigate } from 'react-router-dom';

export const TrainerDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, enrollmentsData, convosData] = await Promise.all([
          getCourses(),
          getLearners(),
          getConversations()
        ]);
        setCourses(coursesData);
        setEnrollments(enrollmentsData);
        setConversations(convosData);
      } catch (error) {
        console.error('Failed to fetch trainer data', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate live KPIs
  const activeLearners = new Set(enrollments.map((e: any) => e.learnerId)).size;
  const activeCourses = courses.length;
  const avgProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((acc: number, e: any) => acc + e.progress, 0) / enrollments.length)
    : 0;
    
  const unreadMessages = conversations.reduce((acc: number, c: any) => {
    return acc + (c.messages && c.messages[0] && !c.messages[0].readAt && c.messages[0].senderId !== user?.id ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-32 pb-32 pt-10 font-sans selection:bg-purple-500/30">
      
      {/* HERO / OPERATIONS CORE */}
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
            Trainer Operations Center
          </h2>
          <h1 className="text-sm font-medium tracking-[0.3em] text-slate-700 uppercase">
            Orchestrating learning experiences
          </h1>
        </motion.div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="text-[10rem] md:text-[12rem] font-light leading-none tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-slate-900 to-slate-500">
            {activeLearners}
          </div>
          <div className="text-sm font-bold tracking-[0.2em] text-purple-600 mt-4 uppercase">
            Active Learners
          </div>
          <div className="text-xs tracking-widest text-emerald-600/80 mt-2 font-medium uppercase">
            across {activeCourses} courses
          </div>
        </div>

        {/* Constellation Nodes for Trainer */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { id: '1', x: '50%', y: '10%', label: `Unread Messages (${unreadMessages})` },
            { id: '2', x: '80%', y: '50%', label: `Courses (${activeCourses})` },
            { id: '3', x: '50%', y: '90%', label: `Avg Progress (${avgProgress}%)` },
            { id: '4', x: '20%', y: '50%', label: `Enrollments (${enrollments.length})` },
          ].map(node => (
            <div 
              key={node.id} 
              className="absolute pointer-events-auto flex flex-col items-center gap-2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 hover:scale-110 cursor-crosshair"
              style={{ left: node.x, top: node.y }}
            >
              <div className="w-3 h-3 rounded-full bg-slate-300 hover:bg-purple-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all" />
              <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-slate-500 hover:text-purple-700 transition-colors whitespace-nowrap">
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

      {/* RECENT LEARNERS / ENROLLMENTS */}
      <section className="mt-20">
        <h3 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-8">
          Recent Enrollments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {enrollments.slice(0, 3).map((enrollment: any) => (
            <div key={enrollment.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-slate-800">{enrollment.learner?.name}</h4>
                  <p className="text-sm text-slate-500">{enrollment.course?.title}</p>
                </div>
                <div className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                  {Math.round(enrollment.progress)}%
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-600 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${enrollment.progress}%` }}
                />
              </div>
            </div>
          ))}
          {enrollments.length === 0 && (
            <div className="col-span-3 text-center text-slate-500 py-10">
              No active learners yet.
            </div>
          )}
        </div>
      </section>

      {/* YOUR COURSES */}
      <section className="border-t border-slate-100 pt-20">
        <div className="flex justify-between items-end mb-8">
          <h3 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
            Your Courses
          </h3>
          <button 
            onClick={() => navigate('/trainer/courses')}
            className="text-sm font-bold tracking-widest text-purple-600 hover:text-purple-800 uppercase flex items-center gap-1"
          >
            Manage <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.slice(0, 4).map((course: any) => (
            <div key={course.id} className="flex flex-col bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-slate-800">{course.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${course.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {course.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2">{course.description}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex gap-2">
                  {course.courseSkills?.slice(0,2).map((cs: any) => (
                    <span key={cs.id} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                      {cs.skill?.name}
                    </span>
                  ))}
                </div>
                <div className="text-sm font-medium text-slate-600 flex items-center gap-1">
                  <Users size={14} /> 
                  {enrollments.filter((e: any) => e.courseId === course.id).length}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
