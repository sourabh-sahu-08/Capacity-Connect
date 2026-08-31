import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { PasswordStrengthIndicator } from '../../components/auth/PasswordStrengthIndicator';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await authApi.resetPassword(token, { password });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title={success ? "Password Reset" : "Create New Password"} 
      subtitle={!success ? "Enter your new password below." : ""}
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-6 text-center space-y-4"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Password Reset Successfully</h3>
            <p className="text-slate-500 max-w-sm">You can now sign in with your new password.</p>
            <div className="pt-6 w-full">
              <Link to="/login">
                <AuthButton>Continue to Sign In &rarr;</AuthButton>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit} 
            className="space-y-5"
          >
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}
            
            <div>
              <AuthInput
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="��������"
                required
              />
              <PasswordStrengthIndicator password={password} />
            </div>
            
            <AuthInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="��������"
              isValid={password === confirmPassword && confirmPassword.length > 0}
              error={confirmPassword.length > 0 && password !== confirmPassword ? "Passwords do not match" : undefined}
              required
            />

            <div className="pt-2">
              <AuthButton type="submit" isLoading={isLoading} loadingText="Resetting..." disabled={!password || password !== confirmPassword}>
                Reset Password
              </AuthButton>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};
