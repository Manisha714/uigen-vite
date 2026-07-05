import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'danger';
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorStyles = {
    primary: 'border-blue-600',
    secondary: 'border-gray-600',
    success: 'border-green-600',
    danger: 'border-red-600',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeStyles[size]} border-4 border-gray-200 rounded-full animate-spin ${colorStyles[color]}`}
        style={{
          borderTopColor: 'currentColor',
        }}
      />
    </div>
  );
};
