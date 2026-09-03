// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, X } from 'lucide-react';
import { getCourses, createCourse } from '../../api/trainerApi';
import { motion, AnimatePresence } from 'framer-motion';

export const CoursesList = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'Active' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCourse(formData);
      setIsModalOpen(false);
      setFormData({ title: '', description: '', status: 'Active' });
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">My Training Programs</h1>
          <p className="text-sm text-slate-500">Manage your active courses, drafts, and past programs.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg text-sm font-bold tracking-widest uppercase shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Course
        </button>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input type="text" placeholder="Search courses..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {['Active', 'Drafts', 'Completed', 'Archived'].map(tab => (
          <button key={tab} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'Active' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div></div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-slate-500">No courses created yet. Click "Create Course" to get started.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Link key={course._id} to={`/trainer/courses/${course._id}`} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-purple-300 hover:shadow-md transition-all group flex flex-col h-full">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg mb-2">{course.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-6">{course.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-auto">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Status</p>
                  <p className="font-medium text-slate-900">{course.status}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Created</p>
                  <p className="font-medium text-slate-900">{new Date(course.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Create New Course</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">Course Title</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                    placeholder="e.g. Advanced System Design"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">Description</label>
                  <textarea 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors min-h-[100px]"
                    placeholder="Brief description of the course objectives..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-3 text-white font-bold text-sm bg-purple-600 hover:bg-purple-700 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-colors">
                    Create Course
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
