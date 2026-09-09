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
    <div className="space-y-1 mt-1 p-2 bg-slate-50 rounded-lg border border-slate-100">
      <div className="flex justify-between items-center text-[11px]">
        <span className="font-medium text-slate-400">Password strength:</span>
        <span className={score === 3 ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>{password ? strengthLabel : ''}</span>
      </div>
      <div className="h-1 w-full bg-slate-200/20 rounded-full overflow-hidden flex gap-1">
        <div className={`h-full flex-1 ${password.length > 0 ? colorClass : 'bg-transparent'} transition-all`} />
        <div className={`h-full flex-1 ${score >= 2 ? colorClass : 'bg-transparent'} transition-all`} />
        <div className={`h-full flex-1 ${score >= 3 ? colorClass : 'bg-transparent'} transition-all`} />
      </div>
      <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-400 pt-0.5">
        <div className="flex items-center gap-1">
          <Check size={11} className={hasLength ? 'text-emerald-400 shrink-0' : 'text-slate-500 shrink-0'} /> 8+ chars
        </div>
        <div className="flex items-center gap-1">
          <Check size={11} className={hasUpper ? 'text-emerald-400 shrink-0' : 'text-slate-500 shrink-0'} /> 1 Uppercase
        </div>
        <div className="flex items-center gap-1">
          <Check size={11} className={hasNumber ? 'text-emerald-400 shrink-0' : 'text-slate-500 shrink-0'} /> 1 Number
        </div>
      </div>
    </div>
  );
};
