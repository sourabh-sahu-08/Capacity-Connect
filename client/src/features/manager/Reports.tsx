// @ts-nocheck
import { FileText, Download } from 'lucide-react';

export const Reports = () => {
  
  const handleExportCSV = () => {
    // Generate a simple real CSV of mock team data
    const headers = "Team,Members,Competency,Readiness,Risk Level\n";
    const rows = [
      "Engineering,124,78%,72%,Low",
      "Product,42,64%,58%,High",
      "Design,32,81%,84%,Low"
    ].join("\n");
    
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
