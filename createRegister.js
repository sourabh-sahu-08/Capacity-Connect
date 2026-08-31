const fs = require('fs');

const registerContent = `import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth.api';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { RoleSelector } from '../../components/auth/RoleSelector';
import { PasswordStrengthIndicator } from '../../components/auth/PasswordStrengthIndicator';
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('LEARNER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleNextStep = () => {
    if (step === 2 && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.register({ name, email, password, role, organization });
      
      setSuccess(true);
      
      setTimeout(() => {
        setAuth(response.data, response.data.token);
        if (role === 'MANAGER' || role === 'ADMIN') {
          navigate('/manager-dashboard');
        } else if (role === 'TRAINER') {
          navigate('/onboarding-trainer');
        } else {
          navigate('/onboarding');
        }
      }, 1500);

    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout 
      title={step === 1 ? 'Choose your role' : step === 2 ? 'Create account' : 'Confirm details'} 
      subtitle={
        step === 1 ? 'How will you use Capacity Connect?' : 
        step === 2 ? 'Enter your details to get started.' : 
        'Review your information before joining.'
      }
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
            key="success"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Capacity Connect!</h3>
            <p className="text-slate-500">Preparing your personalized experience...</p>
          </motion.div>
        ) : (
          <motion.div
            key={\`step-\${step}\`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {error && (
              <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}
            
            {step === 1 && (
              <div className="space-y-6">
                <RoleSelector selectedRole={role} onSelect={setRole} />
                <div className="pt-4">
                  <AuthButton onClick={handleNextStep}>Continue &rarr;</AuthButton>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <AuthInput
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                />
                <AuthInput
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  required
                />
                
                <div>
                  <AuthInput
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <PasswordStrengthIndicator password={password} />
                </div>
                
                <AuthInput
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  isValid={password === confirmPassword && confirmPassword.length > 0}
                  error={confirmPassword.length > 0 && password !== confirmPassword ? "Passwords do not match" : undefined}
                  required
                />

                <AuthInput
                  label="Organization (Optional)"
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Acme Corp"
                />

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={handlePrevStep} className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                  </button>
                  <AuthButton onClick={handleNextStep} disabled={!name || !email || !password || password !== confirmPassword}>Review Details &rarr;</AuthButton>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Joining As</span>
                    <p className="font-medium text-slate-900 mt-1">{role.charAt(0) + role.slice(1).toLowerCase()}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</span>
                    <p className="font-medium text-slate-900 mt-1">{name}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</span>
                    <p className="font-medium text-slate-900 mt-1">{email}</p>
                  </div>
                  {organization && (
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Organization</span>
                      <p className="font-medium text-slate-900 mt-1">{organization}</p>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={handlePrevStep} className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-500" disabled={isLoading}>
                    <ArrowLeft size={20} />
                  </button>
                  <AuthButton onClick={handleSubmit} isLoading={isLoading} loadingText="Creating Account...">Create Account &rarr;</AuthButton>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="text-center text-sm text-slate-600 mt-8">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-500">
                  Sign In
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};
`;

fs.writeFileSync('client/src/features/auth/Register.tsx', registerContent, 'utf8');
