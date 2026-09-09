import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Settings, Plus, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import { publishCourse } from '../../api/trainerApi';

export const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/api/courses/${id}`);
      setCourse(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);
      await publishCourse(id as string);
      await fetchCourse();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!course) return <div className="p-20 text-center">Course not found</div>;

  return (
    <div className="space-y-6 pb-32">
      <Link to="/trainer/courses" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </Link>
      
      <header className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2 py-1 text-xs font-bold tracking-widest uppercase rounded ${course.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {course.status}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{course.title}</h1>
        </div>
        <div className="flex gap-2">
          {course.status !== 'PUBLISHED' && (
            <button 
              onClick={handlePublish}
              disabled={publishing}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-sm font-bold tracking-widest uppercase shadow-sm disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" /> {publishing ? 'Publishing...' : 'Publish'}
            </button>
          )}
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-200 bg-white shadow-sm">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {['Overview', 'Content', 'Skills', 'Assessments'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 min-h-[400px]">
        {activeTab === 'Overview' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Description</h3>
              <p className="text-slate-600">{course.description}</p>
            </div>
          </div>
        )}
        
        {activeTab === 'Content' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900">Modules & Lessons</h3>
            </div>
            
            {course.modules?.length === 0 ? (
              <p className="text-slate-500 text-sm">No modules yet.</p>
            ) : (
              <div className="space-y-4">
                {course.modules?.map((mod: any, i: number) => (
                  <div key={mod.id} className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-bold text-slate-900">Module {i + 1}: {mod.title}</h4>
                    <div className="mt-4 space-y-2 pl-4 border-l border-slate-200">
                      {mod.lessons?.map((les: any) => (
                        <div key={les.id} className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                          {les.title} ({les.duration}m)
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Skills' && (
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Mapped Skills</h3>
            <div className="flex gap-2 flex-wrap">
              {course.courseSkills?.map((cs: any) => (
                <div key={cs.id} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                  {cs.skill?.name} (Target: {cs.targetLevel})
                </div>
              ))}
              {course.courseSkills?.length === 0 && <p className="text-slate-500 text-sm">No skills mapped.</p>}
            </div>
          </div>
        )}
        
        {activeTab === 'Assessments' && (
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Assessments</h3>
            {course.assessments?.map((a: any) => (
              <div key={a.id} className="p-4 border border-slate-200 rounded-lg mb-2">
                <p className="font-bold">{a.title}</p>
                <p className="text-sm text-slate-500">Passing Score: {a.passingScore}</p>
              </div>
            ))}
            {course.assessments?.length === 0 && <p className="text-slate-500 text-sm">No assessments created.</p>}
          </div>
        )}
      </div>
    </div>
  );
};
