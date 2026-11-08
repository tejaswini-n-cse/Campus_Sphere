import React, { useState } from 'react';
import { dbStore } from '../../lib/supabase';
import { Save } from 'lucide-react';

export const FacultyDashboard: React.FC = () => {
  const [sheet, setSheet] = useState<Record<string, 'present' | 'absent' | 'late'>>({
    'stud-1': 'present',
    'stud-2': 'present',
    'stud-3': 'absent'
  });
  const [saved, setSaved] = useState(false);

  const toggle = (id: string, st: 'present' | 'absent' | 'late') => {
    setSheet((prev) => ({ ...prev, [id]: st }));
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Faculty Academic Console</h1>
        <p className="text-xs text-slate-500">Mark daily attendance and manage coursework deliverables.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Mark Attendance Sheet</h3>
            <p className="text-xs text-slate-500">Cloud Computing Architecture (CS601)</p>
          </div>
          <button
            onClick={() => setSaved(true)}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
          >
            <Save className="w-4 h-4" />
            <span>{saved ? 'Saved!' : 'Save Attendance'}</span>
          </button>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-5">Reg #</th>
              <th className="py-3 px-5">Student Name</th>
              <th className="py-3 px-5 text-center">Mark Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {dbStore.students.map((s) => (
              <tr key={s.id}>
                <td className="py-3 px-5 font-mono font-bold text-slate-700">{s.registration_number}</td>
                <td className="py-3 px-5 font-bold text-slate-900">{s.profile.first_name} {s.profile.last_name}</td>
                <td className="py-3 px-5 text-center">
                  <div className="inline-flex gap-1.5">
                    {(['present', 'late', 'absent'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => toggle(s.id, status)}
                        className={
                          sheet[s.id] === status
                            ? (status === 'present' ? 'bg-emerald-600 text-white' : status === 'late' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white') + ' px-3 py-1 rounded-md text-[11px] font-bold uppercase transition'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1 rounded-md text-[11px] font-bold uppercase transition'
                        }
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
