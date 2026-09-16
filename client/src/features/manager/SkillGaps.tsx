import React, { useEffect, useState } from 'react';
import { Crosshair, AlertTriangle, ArrowRight } from 'lucide-react';
import { getOrganizationalSkillGaps } from '../../api/intelligenceApi';

export const SkillGaps = () => {
  const [gaps, setGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrganizationalSkillGaps().then(res => {
      setGaps(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Strategic Skill Gaps</h1>
        <p className="text-sm text-slate-500">Identify and address critical capability gaps across the workforce.</p>
      </header>

      {loading ? (
        <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin"></div>
          Analyzing organizational capabilities...
        </div>
      ) : gaps.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white border border-slate-200 rounded-xl">
          <Crosshair className="w-12 h-12 mx-auto text-emerald-400 mb-3" />
          <h3 className="font-bold text-slate-900">No Critical Gaps Detected</h3>
          <p className="text-sm mt-1">Your workforce capability meets all target requirements.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {gaps.map(gap => (
            <div key={gap.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between hover:border-purple-300 transition-colors cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${gap.severity === 'HIGH' ? 'bg-rose-100 text-rose-600' : gap.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{gap.skill}</h3>
                  <div className="flex gap-3 text-xs font-medium text-slate-500">
                    <span className="bg-slate-100 px-2 py-1 rounded">{gap.affected} Employees Affected</span>
                    <span className="bg-slate-100 px-2 py-1 rounded">Business Impact: {gap.importance}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded ${gap.severity === 'HIGH' ? 'text-rose-700 bg-rose-50' : gap.severity === 'MEDIUM' ? 'text-amber-700 bg-amber-50' : 'text-blue-700 bg-blue-50'}`}>
                  {gap.severity} SEVERITY
                </span>
                <ArrowRight className="text-slate-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
