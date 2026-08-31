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
      <div className="space-y-1 w-full">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`block w-full appearance-none rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm transition-colors ${
              error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 
              isValid ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500' : 
              'border-slate-200 focus:border-purple-500'
            }`}
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
