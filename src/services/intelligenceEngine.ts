import type { StudentProfile, AttendanceRecord, JobOpening } from '../types';

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
