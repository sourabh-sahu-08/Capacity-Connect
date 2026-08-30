import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Area, AreaChart, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const skillsData = [
  { subject: 'React.js', A: 88, fullMark: 100 },
  { subject: 'Node.js', A: 70, fullMark: 100 },
  { subject: 'MongoDB', A: 62, fullMark: 100 },
  { subject: 'Docker', A: 48, fullMark: 100 },
  { subject: 'AWS', A: 35, fullMark: 100 },
];

const historyData = [
  { name: 'January', score: 62 },
  { name: 'March', score: 68 },
  { name: 'June', score: 73 },
  { name: 'August', score: 78 },
];

export const CompetencyProfile = () => {
  return (
    <div className="p-8 space-y-8 text-white max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Competency Passport</h1>
          <p className="text-zinc-400 mt-2">Your digital capability overview.</p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-extrabold text-indigo-400">78 <span className="text-xl text-zinc-500">/ 100</span></div>
          <div className="text-emerald-400 font-medium tracking-wide text-sm mt-1 uppercase">Advanced Learner</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-6">Skill Map</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                <PolarGrid stroke="#3f3f46" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                <Radar name="Competency" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl space-y-6">
          <h2 className="text-xl font-bold">Technical Skills</h2>
          <div className="space-y-4">
            {skillsData.map(skill => (
              <div key={skill.subject}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-zinc-200">{skill.subject}</span>
                  <span className="text-zinc-400">{skill.A}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${skill.A}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-6">Competency History</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" stroke="#71717a" tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
