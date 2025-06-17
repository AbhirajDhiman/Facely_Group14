import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';
import { useToast } from '@/components/ui/use-toast';

export interface User {
  _id: string;
  name: string;
  email: string;
  profilePic: string;
  isVerified: boolean;
  createdGroups: string[];
  joinedGroups: string[];
  faceEmbedding: number[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (formData: FormData) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Configure axios
  axios.defaults.withCredentials = true;
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.AUTH.CHECK_AUTH}`);
        if (res.data.success) {
          setUser(res.data.user);
          console.log("user", res.data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log('Not authenticated');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.SIGNIN}`, { email, password }, {
        withCredentials: true,
      });
      if (res.data.success) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        toast({
          title: "Login successful",
          description: `Welcome back, ${res.data.user.name}!`,
        });
      }
      return res.data;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (formData: FormData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.SIGNUP}`, formData);
      if (res.data.success) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        toast({
          title: "Signup successful",
          description: "Please check your email for verification code.",
        });
      }
      return res.data;
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.SIGNOUT}`);
      setUser(null);
      setIsAuthenticated(false);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const verifyEmail = async (code: string) => {
    try {
      const res = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.VERIFY_EMAIL}`, { code });
      if (res.data.success) {
        setUser((prev) => prev ? { ...prev, isVerified: true } : null);
        toast({
          title: "Email verified",
          description: "Your email has been verified successfully.",
        });
      }
      return res.data;
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`, { email });
      if (res.data.success) {
        toast({
          title: "Email sent",
          description: "Please check your email for reset instructions.",
        });
      }
      return res.data;
    } catch (error: any) {
      toast({
        title: "Request failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const res = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.RESET_PASSWORD}/${token}`, { password });
      if (res.data.success) {
        toast({
          title: "Password reset successful",
          description: "You can now log in with your new password.",
        });
      }
      return res.data;
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resendVerification = async (email: string) => {
    try {
      const res = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.RESEND_VERIFICATION}`, { email });
      if (res.data.success) {
        toast({
          title: "Email sent",
          description: "Please check your email for verification code.",
        });
      }
      return res.data;
    } catch (error: any) {
      toast({
        title: "Request failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        signup,
        logout,
        verifyEmail,
        forgotPassword,
        resetPassword,
        resendVerification,
      }}
    >
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
