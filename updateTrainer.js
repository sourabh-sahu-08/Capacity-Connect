const fs = require('fs');
let content = fs.readFileSync('client/src/features/dashboard/TrainerDashboard.tsx', 'utf8');

const newSection = `
          {/* 9. ACTIVE TRAINING PROGRAMS */}
          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">Active Training Programs</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {data.activePrograms.map(program => (
                <div key={program.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 tracking-widest uppercase text-sm mb-1">{program.name}</h3>
                    <p className="text-slate-500 text-sm">{program.learners} Learners</p>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold tracking-widest uppercase text-slate-500">Overall Progress</span>
                      <span className="text-sm font-medium text-slate-700">{program.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: \`\${program.progress}%\` }}></div>
                    </div>
                  </div>

                  <div className="flex-1 md:text-right border-l-0 md:border-l border-slate-200 md:pl-6">
                    <span className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">Next Session</span>
                    <span className="block text-sm font-medium text-slate-900">{program.nextSession}</span>
                    <span className="block text-xs text-indigo-600 font-medium mt-1">{program.time}</span>
                  </div>

                  <div className="shrink-0">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold tracking-widest uppercase text-slate-600 hover:bg-slate-50">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
`;

content = content.replace("        </div>\n\n        {/* RIGHT COLUMN", newSection + "\n\n        {/* RIGHT COLUMN");
content = content.replace("        </div>\r\n\r\n        {/* RIGHT COLUMN", newSection + "\r\n\r\n        {/* RIGHT COLUMN");

fs.writeFileSync('client/src/features/dashboard/TrainerDashboard.tsx', content, 'utf8');
