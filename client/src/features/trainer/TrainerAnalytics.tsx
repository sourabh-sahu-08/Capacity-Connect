// @ts-nocheck
import { BarChart3, TrendingUp, Users } from 'lucide-react';

export const TrainerAnalytics = () => {
  const [range, setRange] = useState('30D');
  
  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Performance Analytics</h1>
          <p className="text-sm text-slate-500">Deep dive into learner engagement and course metrics.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
          {['7D', '30D', '90D', 'Custom'].map(r => (
            <button key={r} onClick={() => setRange(r)} className={`px-3 py-1 rounded text-xs font-bold tracking-widest uppercase ${range === r ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
              {r}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col">
          <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-6">Learner Engagement Trend</h3>
          <div className="flex-1 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            [ Engagement Chart ]
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col">
          <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-6">Assessment Score Distribution</h3>
          <div className="flex-1 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            [ Distribution Chart ]
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col lg:col-span-2">
          <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-6">Course Completion Velocity</h3>
          <div className="flex-1 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            [ Velocity Chart ]
          </div>
        </div>
      </div>
    </div>
  );
};
