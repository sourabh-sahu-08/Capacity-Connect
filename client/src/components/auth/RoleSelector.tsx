import React from 'react';
import { Role } from 'shared';
import { GraduationCap, Briefcase, BarChart, CheckCircle2 } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: string;
  onSelect: (role: string) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelect }) => {
  const roles = [
    {
      id: Role.LEARNER,
      title: 'LEARNER',
      icon: GraduationCap,
      description: 'Build skills and grow your professional capability.',
    },
    {
      id: Role.TRAINER,
      title: 'TRAINER',
      icon: Briefcase,
      description: 'Create training experiences and help learners grow.',
    },
    {
      id: Role.MANAGER,
      title: 'MANAGER',
      icon: BarChart,
      description: 'Monitor workforce capability and team readiness.',
    }
    // Admin is intentionally omitted from public selection
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {roles.map((role) => {
        const Icon = role.icon;
        const isSelected = selectedRole === role.id;
        return (
          <div
            key={role.id}
            onClick={() => onSelect(role.id)}
            className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 ${
              isSelected 
                ? 'border-purple-600 bg-purple-50 shadow-md transform scale-[1.02]' 
                : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-sm hover:scale-[1.01]'
            }`}
          >
            {isSelected && (
              <div className="absolute top-3 right-3 text-purple-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${isSelected ? 'bg-purple-200 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{role.title}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{role.description}</p>
          </div>
        );
      })}
    </div>
  );
};
