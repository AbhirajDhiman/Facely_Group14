
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { Mail, RefreshCw } from 'lucide-react';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  
  const { user, verifyEmail, resendVerification } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user?.isVerified) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      await verifyEmail(code);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify email. Please check your code.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResendCode = async () => {
    if (countdown > 0 || !user?.email) return;
    
    setError(null);
    setIsResending(true);
    
    try {
      await resendVerification(user.email);
      setCountdown(60); // 60 second countdown
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend verification code.');
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6 mx-auto">
              <Mail size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-muted-foreground">
              We've sent a verification code to <strong>{user?.email}</strong>.
              Enter the code below to verify your account.
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                id="code"
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-center text-lg py-6"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !code.trim()}
            >
              {isSubmitting ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Didn't receive the code?
            </p>
            <Button
              variant="outline"
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} className={isResending ? "animate-spin" : ""} />
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
