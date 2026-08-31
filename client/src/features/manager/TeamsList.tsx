// @ts-nocheck
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
                  <Link to={`/manager/teams/${team.id}`} className="font-bold text-slate-900 hover:text-purple-600 transition-colors">{team.name}</Link>
                </td>
                <td className="px-6 py-4 text-slate-500">{team.m}</td>
                <td className="px-6 py-4 text-slate-900 font-medium">{team.comp}%</td>
                <td className="px-6 py-4 text-slate-900 font-medium">{team.read}%</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${team.risk === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
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
