import React from 'react';

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
      className={`group relative flex w-full justify-center rounded-lg border border-transparent bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.3)] py-3 px-4 text-sm font-medium text-white hover:bg-purple-700 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
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
