const fs = require('fs');

const teamsList = `import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ShieldAlert } from 'lucide-react';

export const TeamsList = () => {
  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Teams</h1>
        <p className="text-sm text-slate-500">Monitor capability and readiness across all departments.</p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input type="text" placeholder="Search teams..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Team Name</th>
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Members</th>
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Competency</th>
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Readiness</th>
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Risk Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { id: 1, name: 'Engineering', m: 124, comp: 78, read: 72, risk: 'Low' },
              { id: 2, name: 'Product', m: 42, comp: 64, read: 58, risk: 'High' }
            ].map(team => (
              <tr key={team.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <Link to={\`/manager/teams/\${team.id}\`} className="font-bold text-slate-900 hover:text-purple-600 transition-colors">{team.name}</Link>
                </td>
                <td className="px-6 py-4 text-slate-500">{team.m}</td>
                <td className="px-6 py-4 text-slate-900 font-medium">{team.comp}%</td>
                <td className="px-6 py-4 text-slate-900 font-medium">{team.read}%</td>
                <td className="px-6 py-4">
                  <span className={\`px-2 py-1 text-[10px] font-bold uppercase rounded \${team.risk === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}\`}>
                    {team.risk} Risk
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
`;

const teamDetail = `import React, { useState } from 'react';
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
          <p className="text-sm text-slate-500 mt-1">124 Members • Director: Alex Rivera</p>
        </div>
      </header>

      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {['Overview', 'Members', 'Capabilities', 'Skill Gaps', 'Performance', 'Learning Activity'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={\`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors \${activeTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-900'}\`}
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
`;

const capabilityIntelligence = `import React from 'react';
import { Hexagon } from 'lucide-react';

export const CapabilityIntelligence = () => {
  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Capability Intelligence</h1>
        <p className="text-sm text-slate-500">Organization-wide competency maps and capability distribution.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-xl p-8 min-h-[500px] flex flex-col items-center justify-center text-slate-400">
        <Hexagon size={48} className="mb-4 text-purple-200" />
        <p className="font-medium text-slate-900">Capability Heatmap</p>
        <p className="text-sm">Interactive visualization loading...</p>
      </div>
    </div>
  );
};
`;

const skillGaps = `import React from 'react';
import { Crosshair, AlertTriangle, ArrowRight } from 'lucide-react';

export const SkillGaps = () => {
  const gaps = [
    { id: 1, skill: 'Cloud Infrastructure', affected: 46, importance: 'Critical', severity: 'HIGH' },
    { id: 2, skill: 'System Design', affected: 38, importance: 'High', severity: 'HIGH' },
    { id: 3, skill: 'Data Analytics', affected: 29, importance: 'Medium', severity: 'MEDIUM' }
  ];

  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Strategic Skill Gaps</h1>
        <p className="text-sm text-slate-500">Identify and address critical capability gaps across the workforce.</p>
      </header>

      <div className="grid gap-4">
        {gaps.map(gap => (
          <div key={gap.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between hover:border-purple-300 transition-colors cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className={\`w-10 h-10 rounded-full flex items-center justify-center shrink-0 \${gap.severity === 'HIGH' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}\`}>
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
              <span className={\`text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded \${gap.severity === 'HIGH' ? 'text-rose-700 bg-rose-50' : 'text-amber-700 bg-amber-50'}\`}>
                {gap.severity} SEVERITY
              </span>
              <ArrowRight className="text-slate-400 group-hover:text-purple-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
`;

fs.writeFileSync('client/src/features/manager/TeamsList.tsx', teamsList, 'utf8');
fs.writeFileSync('client/src/features/manager/TeamDetail.tsx', teamDetail, 'utf8');
fs.writeFileSync('client/src/features/manager/CapabilityIntelligence.tsx', capabilityIntelligence, 'utf8');
fs.writeFileSync('client/src/features/manager/SkillGaps.tsx', skillGaps, 'utf8');
