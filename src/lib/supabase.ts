export const dbStore = {
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
