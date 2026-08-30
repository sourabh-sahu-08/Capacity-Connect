import React from 'react';
import { Users, BookOpen, TrendingUp, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const KPICard = ({ title, value, subtitle, icon: Icon, trend }: any) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-zinc-950 rounded-lg text-indigo-400 border border-zinc-800">
        <Icon size={24} />
      </div>
      {trend && <div className="text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded">{trend}</div>}
    </div>
    <h3 className="text-zinc-400 text-sm font-medium">{title}</h3>
    <div className="text-3xl font-bold text-white mt-1">{value}</div>
    {subtitle && <div className="text-zinc-500 text-xs mt-2">{subtitle}</div>}
  </div>
);

const HEATMAP_DATA = [
  { dept: 'Engineering', React: 85, Node: 70, Cloud: 45, Cyber: 60 },
  { dept: 'Marketing', React: 20, Node: 10, Cloud: 30, Cyber: 40 },
  { dept: 'HR', React: 10, Node: 10, Cloud: 20, Cyber: 75 },
  { dept: 'Operations', React: 40, Node: 50, Cloud: 65, Cyber: 80 },
];

const getColor = (val: number) => {
  if (val >= 80) return '#4f46e5'; // indigo-600
  if (val >= 60) return '#6366f1'; // indigo-500
  if (val >= 40) return '#818cf8'; // indigo-400
  if (val >= 20) return '#a5b4fc'; // indigo-300
  return '#e0e7ff'; // indigo-100
};

export const ManagerDashboard = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto text-white">
      <div>
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        <p className="text-zinc-400 mt-2">Organizational capability and workforce readiness intelligence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Members" value="1,240" icon={Users} trend="+12" />
        <KPICard title="Active Learners" value="945" icon={BookOpen} subtitle="In last 30 days" />
        <KPICard title="Training Completion" value="78%" icon={TrendingUp} trend="+4%" />
        <KPICard title="Average Competency" value="72 / 100" icon={TrendingUp} trend="+2.5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-6">Organizational Skill Heatmap</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-zinc-400 font-medium">Department</th>
                  <th className="p-3 text-zinc-400 font-medium text-center">React.js</th>
                  <th className="p-3 text-zinc-400 font-medium text-center">Node.js</th>
                  <th className="p-3 text-zinc-400 font-medium text-center">Cloud Infra</th>
                  <th className="p-3 text-zinc-400 font-medium text-center">Cybersecurity</th>
                </tr>
              </thead>
              <tbody>
                {HEATMAP_DATA.map(row => (
                  <tr key={row.dept} className="border-t border-zinc-800/50">
                    <td className="p-3 font-medium">{row.dept}</td>
                    {['React', 'Node', 'Cloud', 'Cyber'].map(skill => (
                      <td key={skill} className="p-3 text-center">
                        <div 
                          className="w-full h-8 rounded flex items-center justify-center text-xs font-bold text-white shadow-sm"
                          style={{ backgroundColor: getColor(row[skill as keyof typeof row] as number) }}
                        >
                          {(row[skill as keyof typeof row] as number) >= 40 ? row[skill as keyof typeof row] : ''}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end items-center gap-2 mt-4 text-xs text-zinc-500">
              <span>Low</span>
              <div className="flex">
                {[20, 40, 60, 80].map(v => (
                  <div key={v} className="w-6 h-4" style={{ backgroundColor: getColor(v) }}></div>
                ))}
              </div>
              <span>High</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-amber-500" />
              <h2 className="text-lg font-bold text-amber-500">Skill Gap Insights</h2>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed mb-4">
              <strong className="text-white">Engineering Department</strong> shows a significant cloud infrastructure skill gap compared to target role requirements.
            </p>
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-sm">
              <div className="font-medium text-zinc-400 mb-2">Recommended Action</div>
              <div className="text-white">Assign <span className="text-indigo-400 font-medium cursor-pointer">Cloud Fundamentals Learning Path</span> to 45 at-risk learners.</div>
              <button className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded transition-colors font-medium text-white">Assign Training</button>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h2 className="font-bold mb-4">Team Performance</h2>
            <div className="space-y-4">
              {[
                { name: 'Frontend Team', comp: 82, tr: 95 },
                { name: 'Backend Team', comp: 76, tr: 88 },
                { name: 'DevOps Team', comp: 65, tr: 70 },
              ].map(team => (
                <div key={team.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{team.name}</span>
                    <span className="text-zinc-400">Avg {team.comp}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${team.comp}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
