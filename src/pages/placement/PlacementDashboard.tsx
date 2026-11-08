import React, { useState } from 'react';
import { dbStore } from '../../lib/supabase';
import type { ApplicationStage, PlacementApplication } from '../../types';

export const PlacementDashboard: React.FC = () => {
  const [apps, setApps] = useState<PlacementApplication[]>([...dbStore.applications]);

  const updateStage = (id: string, stage: ApplicationStage) => {
    const updated = apps.map((a) => (a.id === id ? { ...a, stage } : a));
    setApps(updated);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Campus Placement Console</h1>
        <p className="text-xs text-slate-500">Corporate recruitment pipeline and applicant review workflow.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Student Placement Pipeline</h3>
          <p className="text-xs text-slate-500">Manage candidate selection progress across active drives</p>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-5">Candidate</th>
              <th className="py-3 px-5">Reg #</th>
              <th className="py-3 px-5">CGPA</th>
              <th className="py-3 px-5">Company / Role</th>
              <th className="py-3 px-5">Selection Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {apps.map((a) => (
              <tr key={a.id}>
                <td className="py-3 px-5 font-bold text-slate-900">{a.student_name}</td>
                <td className="py-3 px-5 font-mono text-slate-600">{a.student_reg}</td>
                <td className="py-3 px-5 font-bold text-indigo-600">{a.student_cgpa?.toFixed(2)}</td>
                <td className="py-3 px-5">{a.company_name} - {a.job_title}</td>
                <td className="py-3 px-5">
                  <select
                    value={a.stage}
                    onChange={(e) => updateStage(a.id, e.target.value as ApplicationStage)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Assessment">Assessment</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
