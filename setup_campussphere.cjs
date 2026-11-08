const fs = require('fs');
const path = require('path');

const files = {
  // 1. TYPES
  'src/types/index.ts': `export type UserRole = 'admin' | 'faculty' | 'student' | 'placement_officer';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
}

export interface StudentProfile {
  id: string;
  registration_number: string;
  department_id: string;
  batch_year: number;
  semester: number;
  cgpa: number;
  skills: string[];
  profile: UserProfile;
}

export interface AttendanceRecord {
  id: string;
  subject_id: string;
  subject_name?: string;
  student_id: string;
  student_name?: string;
  registration_number?: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface JobOpening {
  id: string;
  company_name: string;
  title: string;
  role_description: string;
  package_lpa: number;
  min_cgpa: number;
  eligible_departments: string[];
  graduation_year: number;
  required_skills: string[];
}

export type ApplicationStage = 'Applied' | 'Shortlisted' | 'Assessment' | 'Interview' | 'Selected' | 'Rejected';

export interface PlacementApplication {
  id: string;
  job_id: string;
  job_title?: string;
  company_name?: string;
  student_id: string;
  student_name?: string;
  student_reg?: string;
  student_cgpa?: number;
  stage: ApplicationStage;
}
`,

  // 2. DATA STORE
  'src/lib/supabase.ts': `export const dbStore = {
  departments: [
    { id: 'dept-1', code: 'CSE', name: 'Computer Science & Engineering', hod: 'Dr. Aris Thorne' },
    { id: 'dept-2', code: 'ECE', name: 'Electronics & Communication', hod: 'Dr. Elena Rostova' },
    { id: 'dept-3', code: 'MECH', name: 'Mechanical Engineering', hod: 'Dr. Marcus Vance' },
  ],
  students: [
    {
      id: 'stud-1',
      registration_number: 'CS20230042',
      department_id: 'dept-1',
      batch_year: 2024,
      semester: 6,
      cgpa: 8.75,
      skills: ['TypeScript', 'React', 'PostgreSQL', 'Python'],
      profile: { id: 'prof-1', email: 'alex.mercer@campussphere.edu', first_name: 'Alex', last_name: 'Mercer', role: 'student' as const, phone: '+1 987 654 3210' }
    },
    {
      id: 'stud-2',
      registration_number: 'CS20230078',
      department_id: 'dept-1',
      batch_year: 2024,
      semester: 6,
      cgpa: 6.95,
      skills: ['Java', 'C++', 'SQL'],
      profile: { id: 'prof-2', email: 'priya.s@campussphere.edu', first_name: 'Priya', last_name: 'Sharma', role: 'student' as const, phone: '+1 987 654 3299' }
    },
    {
      id: 'stud-3',
      registration_number: 'EC20230012',
      department_id: 'dept-2',
      batch_year: 2024,
      semester: 6,
      cgpa: 5.80,
      skills: ['Embedded C', 'MATLAB'],
      profile: { id: 'prof-3', email: 'david.k@campussphere.edu', first_name: 'David', last_name: 'Kim', role: 'student' as const, phone: '+1 987 654 3244' }
    }
  ],
  faculty: [
    {
      id: 'fac-1',
      designation: 'Associate Professor',
      qualification: 'Ph.D. Distributed Systems',
      profile: { id: 'prof-fac', email: 'faculty@campussphere.edu', first_name: 'Dr. Robert', last_name: 'Langdon', role: 'faculty' as const }
    }
  ],
  subjects: [
    { id: 'sub-1', code: 'CS601', name: 'Cloud Computing Architecture' },
    { id: 'sub-2', code: 'CS602', name: 'Full-Stack Software Systems' }
  ],
  attendanceRecords: [
    { id: 'att-1', subject_id: 'sub-1', subject_name: 'Cloud Computing Architecture', student_id: 'stud-1', student_name: 'Alex Mercer', registration_number: 'CS20230042', date: '2026-11-01', status: 'present' as const },
    { id: 'att-2', subject_id: 'sub-1', subject_name: 'Cloud Computing Architecture', student_id: 'stud-2', student_name: 'Priya Sharma', registration_number: 'CS20230078', date: '2026-11-01', status: 'absent' as const },
    { id: 'att-3', subject_id: 'sub-2', subject_name: 'Full-Stack Software Systems', student_id: 'stud-1', student_name: 'Alex Mercer', registration_number: 'CS20230042', date: '2026-11-02', status: 'present' as const },
    { id: 'att-4', subject_id: 'sub-2', subject_name: 'Full-Stack Software Systems', student_id: 'stud-3', student_name: 'David Kim', registration_number: 'EC20230012', date: '2026-11-02', status: 'absent' as const }
  ],
  jobOpenings: [
    {
      id: 'job-1',
      company_name: 'CloudScale Global Systems',
      title: 'Associate Cloud Engineer',
      role_description: 'Architect resilient serverless endpoints and container workloads.',
      package_lpa: 14.5,
      min_cgpa: 7.5,
      eligible_departments: ['CSE', 'ECE'],
      graduation_year: 2024,
      required_skills: ['TypeScript', 'Docker', 'React']
    },
    {
      id: 'job-2',
      company_name: 'DataApex Intelligence',
      title: 'Machine Learning Engineer',
      role_description: 'Develop deep learning pipelines and transformer models.',
      package_lpa: 18.0,
      min_cgpa: 8.5,
      eligible_departments: ['CSE'],
      graduation_year: 2024,
      required_skills: ['Python', 'PyTorch']
    }
  ],
  applications: [
    {
      id: 'app-1',
      job_id: 'job-1',
      job_title: 'Associate Cloud Engineer',
      company_name: 'CloudScale Global Systems',
      student_id: 'stud-1',
      student_name: 'Alex Mercer',
      student_reg: 'CS20230042',
      student_cgpa: 8.75,
      stage: 'Shortlisted' as const
    }
  ],
  saveAll: () => {}
};
`,

  // 3. INTELLIGENCE ENGINE
  'src/services/intelligenceEngine.ts': `import { StudentProfile, AttendanceRecord, JobOpening } from '../types';

export class CampusIntelligenceEngine {
  static evaluateAttendance(students: StudentProfile[], attendance: AttendanceRecord[], threshold = 75) {
    return students.map((student) => {
      const records = attendance.filter((a) => a.student_id === student.id);
      const total = records.length;
      if (total === 0) return { student, pct: 100, isDefaulter: false };
      const attended = records.filter((a) => a.status === 'present' || a.status === 'late').length;
      const pct = Math.round((attended / total) * 100);
      return { student, pct, isDefaulter: pct < threshold };
    });
  }

  static checkEligibility(student: StudentProfile, job: JobOpening) {
    const reasons: string[] = [];
    let isEligible = true;

    if (student.cgpa < job.min_cgpa) {
      isEligible = false;
      reasons.push("Minimum CGPA is " + job.min_cgpa + " (Yours: " + student.cgpa + ")");
    }

    const missingSkills = (job.required_skills || []).filter(
      (req) => !student.skills.some((s) => s.toLowerCase() === req.toLowerCase())
    );

    return { isEligible, reasons, missingSkills };
  }
}
`,

  // 4. AUTH CONTEXT
  'src/contexts/AuthContext.tsx': `import React, { createContext, useContext, useState } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  switchDemoRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('student');
  const [user, setUser] = useState<UserProfile>({
    id: 'user-demo',
    email: 'alex.mercer@campussphere.edu',
    first_name: 'Alex',
    last_name: 'Mercer',
    role: 'student'
  });

  const switchDemoRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'admin') {
      setUser({ id: 'adm', email: 'admin@campussphere.edu', first_name: 'Campus', last_name: 'Director', role: 'admin' });
    } else if (newRole === 'faculty') {
      setUser({ id: 'fac', email: 'faculty@campussphere.edu', first_name: 'Dr. Robert', last_name: 'Langdon', role: 'faculty' });
    } else if (newRole === 'placement_officer') {
      setUser({ id: 'plc', email: 'placement@campussphere.edu', first_name: 'Sarah', last_name: 'Connor', role: 'placement_officer' });
    } else {
      setUser({ id: 'std', email: 'alex.mercer@campussphere.edu', first_name: 'Alex', last_name: 'Mercer', role: 'student' });
    }
  };

  const logout = () => switchDemoRole('student');

  return (
    <AuthContext.Provider value={{ user, role, switchDemoRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be in AuthProvider');
  return ctx;
};
`,

  // 5. NAVBAR
  'src/components/layout/Navbar.tsx': `import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, LogOut } from 'lucide-react';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { user, role, switchDemoRole, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 flex items-center gap-1.5 uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          Role: {role.replace('_', ' ')}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <span className="px-2 text-slate-400">Switch:</span>
          {(['admin', 'faculty', 'student', 'placement_officer'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => switchDemoRole(r)}
              className={
                role === r
                  ? 'px-2.5 py-1 rounded-lg capitalize transition bg-white text-indigo-600 shadow-sm font-bold'
                  : 'px-2.5 py-1 rounded-lg capitalize transition text-slate-600 hover:text-slate-900'
              }
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-slate-200" />

        <div className="text-right">
          <p className="text-xs font-bold text-slate-900">{user?.first_name} {user?.last_name}</p>
          <p className="text-[10px] text-slate-500">{user?.email}</p>
        </div>

        <button onClick={logout} className="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-400 transition">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
`,

  // 6. ADMIN DASHBOARD
  'src/pages/admin/AdminDashboard.tsx': `import React, { useState } from 'react';
import { dbStore } from '../../lib/supabase';
import { CampusIntelligenceEngine } from '../../services/intelligenceEngine';
import { Users, GraduationCap, Building2, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [students, setStudents] = useState([...dbStore.students]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [cgpa, setCgpa] = useState('8.5');

  const defaulters = CampusIntelligenceEngine.evaluateAttendance(students, dbStore.attendanceRecords, 75);
  const flagged = defaulters.filter((d) => d.isDefaulter);

  const chartData = [
    { dept: 'CSE', avgCgpa: 8.2, attendance: 88 },
    { dept: 'ECE', avgCgpa: 7.6, attendance: 74 },
    { dept: 'MECH', avgCgpa: 7.3, attendance: 82 },
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !regNo) return;
    const newStudent = {
      id: 'stud-' + Date.now(),
      registration_number: regNo,
      department_id: 'dept-1',
      batch_year: 2024,
      semester: 6,
      cgpa: parseFloat(cgpa) || 7.5,
      skills: ['Problem Solving', 'Data Structures'],
      profile: {
        id: 'prof-' + Date.now(),
        email: regNo.toLowerCase() + '@campussphere.edu',
        first_name: firstName,
        last_name: lastName || 'Student',
        role: 'student' as const
      }
    };
    dbStore.students.push(newStudent);
    setStudents([...dbStore.students]);
    setFirstName('');
    setLastName('');
    setRegNo('');
  };

  const handleDelete = (id: string) => {
    dbStore.students = dbStore.students.filter((s) => s.id !== id);
    setStudents([...dbStore.students]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">University Administrator Console</h1>
        <p className="text-xs text-slate-500">Live roster management, attendance rules, and campus metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Enrolled Students</span>
            <GraduationCap className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{students.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Faculty Members</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{dbStore.faculty.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Departments</span>
            <Building2 className="w-4 h-4 text-violet-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{dbStore.departments.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Defaulters (&lt;75%)</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2">{flagged.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Academic & Attendance Metric by Department</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dept" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="avgCgpa" name="Avg CGPA" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attendance" name="Attendance %" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Attendance Flagged (&lt;75%)</span>
          </h3>
          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {flagged.map((f) => (
              <div key={f.student.id} className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{f.student.profile.first_name} {f.student.profile.last_name}</p>
                  <p className="text-[11px] text-slate-500">{f.student.registration_number}</p>
                </div>
                <span className="text-xs font-black text-rose-600">{f.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">Enrol New Student Record</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <input
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
          <input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            placeholder="Registration #"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="CGPA"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg px-4 py-2 flex items-center justify-center gap-1.5 transition">
            <Plus className="w-4 h-4" /> Save Student
          </button>
        </form>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">Reg #</th>
                <th className="py-2.5 px-4">CGPA</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="py-3 px-4 font-bold text-slate-900">{s.profile.first_name} {s.profile.last_name}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{s.registration_number}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">{s.cgpa.toFixed(2)}</span></td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleDelete(s.id)} className="p-1 text-slate-400 hover:text-rose-600 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
`,

  // 7. STUDENT DASHBOARD
  'src/pages/student/StudentDashboard.tsx': `import React, { useState } from 'react';
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
`,

  // 8. FACULTY DASHBOARD (Completed properly)
  'src/pages/faculty/FacultyDashboard.tsx': `import React, { useState } from 'react';
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
`,

  // 9. PLACEMENT DASHBOARD
  'src/pages/placement/PlacementDashboard.tsx': `import React, { useState } from 'react';
import { dbStore } from '../../lib/supabase';
import { ApplicationStage } from '../../types';

export const PlacementDashboard: React.FC = () => {
  const [apps, setApps] = useState([...dbStore.applications]);

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
`,

  // 10. APP ROUTER
  'src/App.tsx': `import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { PlacementDashboard } from './pages/placement/PlacementDashboard';

const MainView: React.FC = () => {
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        {role === 'admin' && <AdminDashboard />}
        {role === 'student' && <StudentDashboard />}
        {role === 'faculty' && <FacultyDashboard />}
        {role === 'placement_officer' && <PlacementDashboard />}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainView />
    </AuthProvider>
  );
};

export default App;
`
};

// Write each file to disk
Object.entries(files).forEach(([relPath, content]) => {
  const fullPath = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('[CREATED] ' + relPath);
});

console.log('\n CampusSphere files generated successfully!');