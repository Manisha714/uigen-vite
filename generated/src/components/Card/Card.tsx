import React from 'react';

export interface CardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg',
    outlined: 'bg-transparent border-2 border-blue-500',
  };

  return (
    <div className={`rounded-lg p-6 ${variantStyles[variant]}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {children && <div className="text-gray-700">{children}</div>}
    </div>
  );
};
