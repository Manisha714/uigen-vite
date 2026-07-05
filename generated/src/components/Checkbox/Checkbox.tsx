import React, { useState } from 'react';

export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked: controlledChecked,
  disabled = false,
  onChange,
}) => {
  const [internalChecked, setInternalChecked] = useState(false);
  const checked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setInternalChecked(newChecked);
    onChange?.(newChecked);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      />
      {label && (
        <label className={`text-sm font-medium ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
          {label}
        </label>
      )}
    </div>
  );
};
