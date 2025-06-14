import React, { createContext, useContext, useState } from 'react';

interface UserType {
  username: string;
  role: 'developer' | 'manager';
}

interface AuthContextType {
  isAuthenticated: boolean;
  role: 'developer' | 'manager' | null;
  user: UserType | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: (UserType & { password: string })[] = [
  { username: 'dev1', password: 'dev123', role: 'developer' },
  { username: 'dev2', password: 'dev234', role: 'developer' },
  { username: 'dev3', password: 'dev345', role: 'developer' },
  { username: 'manager', password: 'mgr123', role: 'manager' },
  { username: 'manager2', password: 'mgr234', role: 'manager' },
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<'developer' | 'manager' | null>(null);
  const [user, setUser] = useState<UserType | null>(null);

  const login = (username: string, password: string) => {
    const foundUser = mockUsers.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setIsAuthenticated(true);
      setRole(foundUser.role);
      setUser({ username: foundUser.username, role: foundUser.role });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

<div className="overflow-x-auto">
  <table className="min-w-full border">
    {/* ... */}
  </table>
</div>