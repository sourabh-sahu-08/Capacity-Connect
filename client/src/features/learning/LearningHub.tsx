import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { coursesApi, enrollmentsApi } from '../../api/courses.api';
import { useAuthStore } from '../../store/authStore';

export const LearningHub = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      coursesApi.getAll(),
      user?.role === 'LEARNER' ? enrollmentsApi.getMyEnrollments() : Promise.resolve({ data: [] })
    ])
    .then(([coursesRes, enrollmentsRes]) => {
      setCourses(coursesRes.data);
      setEnrollments(enrollmentsRes.data);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, [user]);

  const handleCourseClick = async (courseId: string, isEnrolled: boolean) => {
    if (user?.role === 'LEARNER' && !isEnrolled) {
      try {
        await coursesApi.enroll(courseId);
        navigate(`/courses/${courseId}`);
      } catch (err) {
        console.error('Failed to enroll', err);
      }
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  return (
    <div className="p-8 space-y-8 text-slate-900 max-w-7xl mx-auto font-sans selection:bg-purple-500/30">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-slate-900">Learning Hub</h1>
          <p className="text-slate-600 mt-2 text-lg">Discover premium courses to build your competencies.</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search courses, skills..." 
              className="w-full bg-white border border-slate-200 rounded-full py-3 pl-10 pr-4 text-slate-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-6 py-3 hover:bg-slate-50 transition-colors font-medium">
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {['All Categories', 'Frontend', 'Backend', 'Data Science', 'Cloud'].map((cat, i) => (
          <button key={cat} className={`px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase transition-colors ${i === 0 ? 'bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        ) : courses.map(course => {
          const enrollment = enrollments.find(e => e.courseId === course.id);
          const isEnrolled = !!enrollment;
          
          return (
            <div 
              key={course.id} 
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col"
            >
              <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                <img src={course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop'} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                  <span className={`text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full ${course.difficulty === 'Advanced' ? 'bg-amber-100 text-amber-700' : (course.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700')}`}>
                    {course.difficulty}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="flex items-center gap-1 text-sm font-bold text-slate-600">
                    <Star className="text-yellow-400 w-4 h-4 fill-yellow-400" /> 4.8
                  </span>
                  <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                    {course.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2 mb-2">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                      {course.trainer?.avatar && <img src={course.trainer.avatar} alt="Trainer" />}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{course.trainer?.name}</span>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-slate-500"><Clock size={16} /> {course.duration}m</span>
                </div>
              </div>
              <div className="p-6 pt-0 mt-auto">
                <button 
                  onClick={() => handleCourseClick(course.id, isEnrolled)}
                  className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold tracking-widest uppercase text-sm transition-colors ${
                    isEnrolled 
                      ? 'bg-slate-100 text-slate-900 hover:bg-slate-200' 
                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                  }`}
                >
                  {isEnrolled ? (
                    <><BookOpen size={18} /> Continue Learning</>
                  ) : (
                    <><ArrowRight size={18} /> Enroll Now</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
