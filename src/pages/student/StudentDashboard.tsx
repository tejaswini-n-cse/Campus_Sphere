import React, { useState } from 'react';
import { dbStore } from '../../lib/supabase';
import { CampusIntelligenceEngine } from '../../services/intelligenceEngine';
import { Briefcase, CheckCircle } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const currentStudent = dbStore.students[0];
  const [appliedJobs, setAppliedJobs] = useState<string[]>(['job-1']);

  const handleApply = (jobId: string) => {
    if (appliedJobs.includes(jobId)) return;
    setAppliedJobs([...appliedJobs, jobId]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase bg-indigo-500/30 text-indigo-200 px-3 py-1 rounded-full border border-indigo-400/20">
            Student Console (B.Tech - CSE)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">Welcome, {currentStudent.profile.first_name}!</h1>
          <p className="text-xs text-indigo-200 mt-1">Reg: <span className="font-mono font-bold text-white">{currentStudent.registration_number}</span></p>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-indigo-200 uppercase font-semibold">Cumulative CGPA</p>
            <p className="text-3xl font-black">{currentStudent.cgpa.toFixed(2)}</p>
          </div>
          <div className="h-10 w-px bg-indigo-700/60" />
          <div>
            <p className="text-xs text-indigo-200 uppercase font-semibold">Overall Attendance</p>
            <p className="text-3xl font-black text-emerald-400">88%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Briefcase className="w-4 h-4 text-indigo-600" />
          <span>Placement Openings & Automated Eligibility Matcher</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dbStore.jobOpenings.map((job) => {
            const eligibility = CampusIntelligenceEngine.checkEligibility(currentStudent, job);
            const isApplied = appliedJobs.includes(job.id);

            return (
              <div key={job.id} className="border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">{job.company_name}</span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{job.title}</h4>
                      <p className="text-xs font-bold text-emerald-600">Package: {job.package_lpa} LPA</p>
                    </div>
                    <span className={
                      eligibility.isEligible
                        ? 'text-[10px] font-bold px-2 py-1 rounded-full uppercase bg-emerald-50 text-emerald-700'
                        : 'text-[10px] font-bold px-2 py-1 rounded-full uppercase bg-rose-50 text-rose-700'
                    }>
                      {eligibility.isEligible ? 'Eligible' : 'Ineligible'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{job.role_description}</p>
                  {eligibility.missingSkills.length > 0 && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg mt-3">
                      <span className="font-bold">Skill Gap:</span> Recommended to learn: {eligibility.missingSkills.join(', ')}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Cut-off: CGPA {job.min_cgpa}</span>
                  {isApplied ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Applied</span>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={!eligibility.isEligible}
                      className={
                        eligibility.isEligible
                          ? 'text-xs font-bold px-4 py-2 rounded-lg transition bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'text-xs font-bold px-4 py-2 rounded-lg transition bg-slate-100 text-slate-400 cursor-not-allowed'
                      }
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
