const fs = require('fs');

const authInputContent = `import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isValid?: boolean;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, isValid, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="space-y-1 w-full">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={\`block w-full appearance-none rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm transition-colors \${
              error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 
              isValid ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500' : 
              'border-slate-200 focus:border-purple-500'
            }\`}
            {...props}
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-2">
            {isValid && !error && <CheckCircle className="h-5 w-5 text-emerald-500" />}
            {error && <AlertCircle className="h-5 w-5 text-red-500" />}
            
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    );
  }
);
AuthInput.displayName = 'AuthInput';
`;

const authButtonContent = `import React from 'react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ 
  isLoading, 
  loadingText = 'Processing...', 
  children, 
  className = '', 
  disabled,
  ...props 
}) => {
  return (
    <button
      disabled={isLoading || disabled}
      className={\`group relative flex w-full justify-center rounded-lg border border-transparent bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.3)] py-3 px-4 text-sm font-medium text-white hover:bg-purple-700 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed \${className}\`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
};
`;

const passIndicatorContent = `import React from 'react';
import { Check } from 'lucide-react';

interface PasswordStrengthProps {
  password?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthProps> = ({ password = '' }) => {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  let score = 0;
  if (hasLength) score++;
  if (hasUpper) score++;
  if (hasNumber) score++;

  let strengthLabel = 'Weak';
  let colorClass = 'bg-red-500';
  if (score === 2) {
    strengthLabel = 'Fair';
    colorClass = 'bg-amber-500';
  } else if (score === 3) {
    strengthLabel = 'Strong';
    colorClass = 'bg-emerald-500';
  }

  return (
    <div className="space-y-2 mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-slate-700">Password strength:</span>
        <span className={score === 3 ? 'text-emerald-600 font-semibold' : 'text-slate-600'}>{password ? strengthLabel : ''}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-1">
        <div className={\`h-full flex-1 \${password.length > 0 ? colorClass : 'bg-transparent'} transition-all\`} />
        <div className={\`h-full flex-1 \${score >= 2 ? colorClass : 'bg-transparent'} transition-all\`} />
        <div className={\`h-full flex-1 \${score >= 3 ? colorClass : 'bg-transparent'} transition-all\`} />
      </div>
      <ul className="text-xs text-slate-600 space-y-1 mt-2">
        <li className="flex items-center gap-2">
          <Check size={14} className={hasLength ? 'text-emerald-500' : 'text-slate-300'} /> At least 8 characters
        </li>
        <li className="flex items-center gap-2">
          <Check size={14} className={hasUpper ? 'text-emerald-500' : 'text-slate-300'} /> One uppercase letter
        </li>
        <li className="flex items-center gap-2">
          <Check size={14} className={hasNumber ? 'text-emerald-500' : 'text-slate-300'} /> One number
        </li>
      </ul>
    </div>
  );
};
`;

fs.writeFileSync('client/src/components/auth/AuthInput.tsx', authInputContent, 'utf8');
fs.writeFileSync('client/src/components/auth/AuthButton.tsx', authButtonContent, 'utf8');
fs.writeFileSync('client/src/components/auth/PasswordStrengthIndicator.tsx', passIndicatorContent, 'utf8');
