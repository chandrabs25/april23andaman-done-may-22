import React from 'react';

interface CheckboxOption {
  label: string;
  value: string;
}

interface CheckboxGroupProps {
  label: string;
  name: string;
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (name: string, selectedValues: string[]) => void;
  helperText?: string;
  gridCols?: number; // Optional prop for grid layout
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  name,
  options,
  selectedValues,
  onChange,
  helperText,
  gridCols = 1, // Default to single column
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let newSelectedValues;
    if (checked) {
      newSelectedValues = [...selectedValues, value];
    } else {
      newSelectedValues = selectedValues.filter((v) => v !== value);
    }
    onChange(name, newSelectedValues);
  };

  // Determine grid class based on prop
  const gridClass = gridCols > 1 ? `grid grid-cols-${gridCols} gap-x-4 gap-y-2` : 'space-y-2';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className={`mt-2 ${gridClass}`}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${name}-${option.value}`}
              name={name}
              type="checkbox"
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor={`${name}-${option.value}`} className="ml-3 block text-sm text-gray-800 cursor-pointer">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {helperText && <p className="mt-2 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
};

