import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth.api';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Login = () => {
  const [email, setEmail] = useState(() => localStorage.getItem('remembered_email') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem('remembered_email'));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('remembered_email', email.trim());
      } else {
        localStorage.removeItem('remembered_email');
      }

      const response = await authApi.login({ email, password, rememberMe });
      
      setSuccess(true);
      
      // Delay routing slightly to show success state
      setTimeout(() => {
        setAuth(response.data, response.data.token);
        const { role, trainerOnboardingCompleted, learnerAssessmentCompleted } = response.data;
        
        if (role === 'MANAGER' || role === 'ADMIN') {
          navigate(role === 'ADMIN' ? '/admin-dashboard' : '/manager/dashboard');
        } else if (role === 'TRAINER') {
          if (!trainerOnboardingCompleted) navigate('/onboarding-trainer');
          else navigate('/trainer/dashboard');
        } else {
          if (!learnerAssessmentCompleted) navigate('/onboarding');
          else navigate('/dashboard');
        }
      }, 1000);

    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'The email or password you entered is incorrect.');
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Continue building capability, one skill at a time."
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Authenticated successfully</h3>
            <p className="text-slate-500">Preparing your workspace...</p>
          </motion.div>
        ) : (
          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit} 
            className="space-y-3"
          >
            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={15} />
                <div className="text-xs text-red-800">
                  <span className="font-semibold block">Unable to sign in</span>
                  {error}
                </div>
              </div>
            )}
            
            <AuthInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourcompany.com"
              required
            />

            <AuthInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-purple-600 focus:ring-purple-600"
                />
                <label htmlFor="remember-me" className="ml-1.5 block text-xs text-slate-300">
                  Remember me
                </label>
              </div>
              
              <Link to="/forgot-password" className="text-xs font-medium text-purple-400 hover:text-purple-300">
                Forgot password?
              </Link>
            </div>

            <div className="pt-1">
              <AuthButton type="submit" isLoading={isLoading} loadingText="Signing in...">
                Sign In &rarr;
              </AuthButton>
            </div>

            <div className="text-center text-xs text-slate-400 mt-3">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-purple-400 hover:text-purple-300">
                Create Account
              </Link>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};
