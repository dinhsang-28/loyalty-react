import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
// import { console } from 'inspector';

interface User {
  id: string;
  memberId:string | null;
  affiliateId:string | null;
  isAdmin?:boolean,
  isAffiliate: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (phone: string, password: string) => Promise<void>;
  register: (name: string,phone:string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);
  let https = 'http://localhost:3000'
  const login = async (phone: string, password: string) => {
    try {
      const response = await axios.post(`${https}/api/auth/login`, { phone, password });
      console.log("data:",response.data);
      const { token: newToken, data: authData} = response.data;
      const userData: User = {
        id: authData.userId,
        memberId: authData.memberId,
        affiliateId: authData.affiliateId,
        isAdmin:authData.isAdmin,
        isAffiliate:authData.isAffiliate
      };
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (name: string,phone:string, email: string, password: string) => {
    try {
      await axios.post(`${https}/api/auth/register`, { name,phone, email, password });
      // const { token: newToken, user: userData } = response.data;
      
      // setToken(newToken);
      // setUser(userData);
      // localStorage.setItem('token', newToken);
      // localStorage.setItem('user', JSON.stringify(userData));
      // axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
