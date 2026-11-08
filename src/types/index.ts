export type UserRole = 'admin' | 'faculty' | 'student' | 'placement_officer';

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
