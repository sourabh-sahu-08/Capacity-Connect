import React from 'react';
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
        <div className={`h-full flex-1 ${password.length > 0 ? colorClass : 'bg-transparent'} transition-all`} />
        <div className={`h-full flex-1 ${score >= 2 ? colorClass : 'bg-transparent'} transition-all`} />
        <div className={`h-full flex-1 ${score >= 3 ? colorClass : 'bg-transparent'} transition-all`} />
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
