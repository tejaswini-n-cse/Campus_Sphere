import React, { useState } from 'react';
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
