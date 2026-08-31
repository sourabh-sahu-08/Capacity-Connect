const fs = require('fs');

const managerAnalytics = `import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export const ManagerAnalytics = () => {
  const [range, setRange] = useState('30D');
  
  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Workforce Analytics</h1>
          <p className="text-sm text-slate-500">Track capability growth and learning engagement over time.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
          {['7D', '30D', '90D', '6M', '1Y'].map(r => (
            <button key={r} onClick={() => setRange(r)} className={\`px-3 py-1 rounded text-xs font-bold tracking-widest uppercase \${range === r ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}\`}>
              {r}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[400px] flex flex-col lg:col-span-2">
          <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-6">Competency Growth Trend</h3>
          <div className="flex-1 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            [ Growth Chart ]
          </div>
        </div>
      </div>
    </div>
  );
};
`;

const readinessPlanning = `import React from 'react';
import { Map, Users } from 'lucide-react';

export const ReadinessPlanning = () => {
  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Readiness Planning</h1>
        <p className="text-sm text-slate-500">Compare current workforce capability against target organizational requirements.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 text-lg mb-6">Role Readiness Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { role: 'Cloud Engineer', current: 54, target: 80, gap: 26, affected: 42 },
            { role: 'Data Analyst', current: 69, target: 75, gap: 6, affected: 18 },
            { role: 'Frontend Dev', current: 78, target: 80, gap: 2, affected: 35 }
          ].map((r, i) => (
            <div key={i} className="border border-slate-100 bg-slate-50 rounded-lg p-5">
              <h4 className="font-bold text-slate-900 mb-4">{r.role}</h4>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Current</span>
                  <span className="font-medium text-slate-900">{r.current}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5"><div className="bg-purple-600 h-1.5 rounded-full" style={{ width: \`\${r.current}%\` }}></div></div>
                
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-slate-500">Target</span>
                  <span className="font-medium text-slate-900">{r.target}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5"><div className="bg-slate-400 h-1.5 rounded-full" style={{ width: \`\${r.target}%\` }}></div></div>
              </div>
              <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase">
                <span className="text-rose-600 bg-rose-50 px-2 py-1 rounded">Gap: {r.gap}%</span>
                <span className="text-slate-500"><Users size={12} className="inline mr-1" /> {r.affected}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
`;

const reportsContent = `import React from 'react';
import { FileText, Download } from 'lucide-react';

export const Reports = () => {
  
  const handleExportCSV = () => {
    // Generate a simple real CSV of mock team data
    const headers = "Team,Members,Competency,Readiness,Risk Level\\n";
    const rows = [
      "Engineering,124,78%,72%,Low",
      "Product,42,64%,58%,High",
      "Design,32,81%,84%,Low"
    ].join("\\n");
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "workforce_intelligence_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Reports</h1>
          <p className="text-sm text-slate-500">Generate and export workforce capability intelligence.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg text-sm font-bold tracking-widest uppercase shadow-sm"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </header>

      <div className="bg-white border border-slate-200 rounded-xl p-8 min-h-[400px] flex flex-col items-center justify-center text-slate-400">
        <FileText size={48} className="mb-4 text-purple-200" />
        <p className="font-medium text-slate-900 text-lg">Generate Custom Report</p>
        <p className="text-sm mt-1 max-w-sm text-center">Use the export button above to download a real CSV of the current capability data.</p>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('client/src/features/manager/ManagerAnalytics.tsx', managerAnalytics, 'utf8');
fs.writeFileSync('client/src/features/manager/ReadinessPlanning.tsx', readinessPlanning, 'utf8');
fs.writeFileSync('client/src/features/manager/Reports.tsx', reportsContent, 'utf8');
