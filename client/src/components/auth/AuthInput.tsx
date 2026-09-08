import React, { forwardRef, useState } from 'react';
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
      <div className="space-y-0.5 w-full">
        <label className="block text-xs font-medium text-slate-300">{label}</label>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`block w-full appearance-none rounded-lg border px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm transition-colors ${
              error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 
              isValid ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500' : 
              'border-slate-200 focus:border-purple-500'
            }`}
            {...props}
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 gap-1.5">
            {isValid && !error && <CheckCircle className="h-4 w-4 text-emerald-500" />}
            {error && <AlertCircle className="h-4 w-4 text-red-500" />}
            
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      </div>
    );
  }
);
AuthInput.displayName = 'AuthInput';
