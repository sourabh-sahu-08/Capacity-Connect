import React from 'react';
import { Role } from 'shared';
import { ArrowRight } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: string;
  onSelect: (role: string) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelect }) => {
  const roles = [
    {
      id: Role.LEARNER,
      title: 'LEARNER',
      description: 'Build skills and grow your professional capability.',
    },
    {
      id: Role.TRAINER,
      title: 'TRAINER',
      description: 'Create training experiences and help learners grow.',
    },
    {
      id: Role.MANAGER,
      title: 'MANAGER',
      description: 'Monitor workforce capability and team readiness.',
    }
    // Admin is intentionally omitted from public selection
  ];

  return (
    <div className="cc-role-selector">
      {roles.map((role) => {
        const isSelected = selectedRole === role.id;
        return (
          <button type="button"
            key={role.id}
            onClick={() => onSelect(role.id)}
            className={`cc-role-option ${isSelected ? 'active' : ''}`}
          >
            <span className="role-number">0{roles.indexOf(role) + 1}</span><span><span className="role-title">{role.title}</span><span className="role-description block">{role.description}</span></span><ArrowRight size={16} />
          </button>
        );
      })}
    </div>
  );
};
