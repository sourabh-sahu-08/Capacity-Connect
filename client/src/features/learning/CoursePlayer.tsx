import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, BookOpen, Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesApi, enrollmentsApi } from '../../api/courses.api';

export const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'copilot' | 'notes'>('copilot');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'ai', content: "Hi! I'm your AI Learning Copilot. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!id) return;
    
    Promise.all([
      coursesApi.getById(id),
      enrollmentsApi.getMyEnrollments()
    ]).then(([courseRes, enrollmentsRes]) => {
      const fetchedCourse = courseRes.data;
      setCourse(fetchedCourse);
      
      const currentEnrollment = enrollmentsRes.data.find((e: any) => e.courseId === id);
      setEnrollment(currentEnrollment);
      
      // Select first lesson by default
      if (fetchedCourse.modules?.length > 0 && fetchedCourse.modules[0].lessons?.length > 0) {
        setActiveLesson(fetchedCourse.modules[0].lessons[0]);
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleCompleteLesson = async () => {
    if (!enrollment || !activeLesson) return;
    try {
      await enrollmentsApi.updateProgress(enrollment.id, {
        lessonId: activeLesson.id,
        completed: true,
        timeSpent: 300 // mock time spent
      });
      // Refresh enrollment to get new progress
      const res = await enrollmentsApi.getMyEnrollments();
      const updated = res.data.find((e: any) => e.courseId === id);
      setEnrollment(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `I'm an AI assistant. I can see you are currently on ${activeLesson?.title}.` 
      }]);
    }, 1000);
  };

  if (loading) return <div className="flex h-[80vh] items-center justify-center"><div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div></div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="h-[calc(100vh-6rem)] -m-8 flex flex-col md:flex-row bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Left: Course Navigation */}
      <div className="w-full md:w-80 border-r border-slate-200 bg-white overflow-y-auto hidden lg:block">
        <div className="p-6 border-b border-slate-200">
          <h2 className="font-bold text-lg leading-tight">{course.title}</h2>
          {enrollment && (
            <>
              <div className="mt-3 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full transition-all" style={{width: `${enrollment.progress}%`}}></div>
              </div>
              <p className="text-xs text-slate-600 mt-2">{Math.round(enrollment.progress)}% Completed</p>
            </>
          )}
        </div>
        <div className="p-4 space-y-4">
          {course.modules?.map((mod: any, i: number) => (
            <div key={mod.id} className="space-y-1">
              <div className="font-medium text-sm text-slate-700 py-2">{i+1}. {mod.title}</div>
              <div className="pl-4 space-y-1 border-l border-slate-200 ml-2">
                {mod.lessons?.map((lesson: any, j: number) => {
                  const isActive = activeLesson?.id === lesson.id;
                  return (
                    <div 
                      key={lesson.id} 
                      onClick={() => setActiveLesson(lesson)}
                      className={`flex gap-2 items-center text-sm py-2 px-2 rounded cursor-pointer transition-colors ${isActive ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800'}`}
                    >
                      <Play size={14} /> {i+1}.{j+1} {lesson.title}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center: Video Player */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <div className="flex-1 relative bg-slate-900 flex items-center justify-center">
          <button className="relative z-10 w-20 h-20 bg-purple-600/90 hover:bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] rounded-full flex items-center justify-center text-white  transition-transform hover:scale-105">
            <Play size={32} className="ml-2" />
          </button>
        </div>
        <div className="h-auto min-h-64 bg-slate-50 p-6 overflow-y-auto border-t border-slate-200 flex justify-between items-start gap-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">{activeLesson?.title || 'Lesson Details'}</h1>
            <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
              {course.description}
            </p>
          </div>
          {enrollment && (
            <button 
              onClick={handleCompleteLesson}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold tracking-widest uppercase text-sm shrink-0 flex items-center gap-2"
            >
              <CheckCircle size={18} /> Mark Complete
            </button>
          )}
        </div>
      </div>

      {/* Right: AI Copilot */}
      <div className="w-full md:w-96 border-l border-slate-200 bg-white flex flex-col">
        <div className="flex border-b border-slate-200">
          <button 
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${activeTab === 'copilot' ? 'border-purple-500 text-purple-600' : 'border-transparent text-slate-600 hover:text-slate-800'}`}
            onClick={() => setActiveTab('copilot')}
          >
            <Sparkles size={16} /> AI Copilot
          </button>
          <button 
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${activeTab === 'notes' ? 'border-purple-500 text-purple-600' : 'border-transparent text-slate-600 hover:text-slate-800'}`}
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
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-300'}`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything about the lesson..." 
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:bg-purple-700 disabled:opacity-50 rounded-xl flex items-center justify-center transition-colors shrink-0"
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
