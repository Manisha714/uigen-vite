import React, { useState } from 'react';

export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  dismissible = false,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const variantStyles = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div className={`inline-flex items-center gap-2 rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]}`}>
      <span>{label}</span>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="ml-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss badge"
        >
          ✕
        </button>
      )}
    </div>
  );
};
