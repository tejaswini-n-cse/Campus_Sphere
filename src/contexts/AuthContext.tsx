import React, { createContext, useContext, useState } from 'react';
// ✅ To this (add the word "type"):
import type { UserProfile, UserRole } from '../types';

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
