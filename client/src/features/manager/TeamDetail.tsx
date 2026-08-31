// @ts-nocheck
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const TeamDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="space-y-6 pb-32">
      <Link to="/manager/teams" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Back to Teams
      </Link>
      
      <header className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Engineering Team</h1>
          <p className="text-sm text-slate-500 mt-1">124 Members � Director: Alex Rivera</p>
        </div>
      </header>

      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {['Overview', 'Members', 'Capabilities', 'Skill Gaps', 'Performance', 'Learning Activity'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 min-h-[400px] flex items-center justify-center text-slate-500">
        <div className="text-center">
          <p className="font-medium text-slate-900">{activeTab} Details</p>
          <p className="text-sm mt-1">Information for this team section will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};
