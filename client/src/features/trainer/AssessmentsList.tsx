// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, FileText, X } from 'lucide-react';
import { getAssessments, createAssessment, getCourses } from '../../api/trainerApi';
import { motion, AnimatePresence } from 'framer-motion';

export const AssessmentsList = () => {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', courseId: '', type: 'Project', maxScore: 100 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assessmentsData, coursesData] = await Promise.all([
        getAssessments(),
        getCourses()
      ]);
      setAssessments(assessmentsData);
      setCourses(coursesData);
      if (coursesData.length > 0) {
        setFormData(prev => ({ ...prev, courseId: coursesData[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseId) return alert('Please create a course first.');
    try {
      await createAssessment(formData);
      setIsModalOpen(false);
      setFormData({ title: '', courseId: courses[0]?._id || '', type: 'Project', maxScore: 100 });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Assessments</h1>
          <p className="text-sm text-slate-500">Manage quizzes, exams, and practical assignments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg text-sm font-bold tracking-widest uppercase shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Assessment
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total active', value: assessments.length.toString() },
          { label: 'Avg Score', value: '74%' },
          { label: 'Pending Evals', value: '0', alert: true },
          { label: 'Pass Rate', value: '81%' }
        ].map(kpi => (
          <div key={kpi.label} className={`bg-white border ${kpi.alert ? 'border-amber-200' : 'border-slate-200'} rounded-lg p-4 shadow-sm`}>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{kpi.label}</p>
            <p className={`text-2xl font-medium mt-1 ${kpi.alert ? 'text-amber-600' : 'text-slate-900'}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Assessment Name</th>
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Course</th>
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Type</th>
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Max Score</th>
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center"><div className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div></td></tr>
            ) : assessments.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">No assessments created yet.</td></tr>
            ) : assessments.map(assessment => (
              <tr key={assessment._id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <Link to={`/trainer/assessments/${assessment._id}`} className="font-medium text-purple-600 hover:text-purple-700">{assessment.title}</Link>
                </td>
                <td className="px-6 py-4 text-slate-500">{assessment.courseId?.title || 'Unknown Course'}</td>
                <td className="px-6 py-4 text-slate-900 font-medium">{assessment.type}</td>
                <td className="px-6 py-4 text-slate-900 font-medium">{assessment.maxScore}</td>
                <td className="px-6 py-4"><span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-emerald-50 text-emerald-700">{assessment.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Create New Assessment</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">Linked Course</label>
                  {courses.length === 0 ? (
                    <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">You must create a course before you can create an assessment.</div>
                  ) : (
                    <select 
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                      value={formData.courseId}
                      onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                    >
                      {courses.map(c => (
                        <option key={c._id} value={c._id}>{c.title}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">Assessment Title</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                    placeholder="e.g. Module 1 Final Challenge"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">Type</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    >
                      <option value="Project">Project</option>
                      <option value="Quiz">Quiz</option>
                      <option value="Exam">Exam</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">Max Score</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                      value={formData.maxScore}
                      onChange={(e) => setFormData({...formData, maxScore: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button disabled={courses.length === 0} type="submit" className="flex-1 py-3 text-white font-bold text-sm bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-colors">
                    Create Assessment
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
