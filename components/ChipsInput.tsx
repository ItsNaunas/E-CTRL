'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface ChipsInputProps {
  label?: string;
  placeholder?: string;
  help?: string;
  error?: string;
  value: string[];
  onChange: (chips: string[]) => void;
  maxChips?: number;
  id?: string;
}

export default function ChipsInput({
  label,
  placeholder = "Type and press Enter...",
  help,
  error,
  value = [],
  onChange,
  maxChips = 5,
  id
}: ChipsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputId = id || `chips-${Math.random().toString(36).substr(2, 9)}`;

  const addChip = (chip: string) => {
    const trimmedChip = chip.trim();
    if (
      trimmedChip && 
      !value.includes(trimmedChip) && 
      value.length < maxChips
    ) {
      onChange([...value, trimmedChip]);
      setInputValue('');
    }
  };

  const removeChip = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addChip(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeChip(value.length - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Handle comma-separated input
    if (newValue.includes(',')) {
      const chips = newValue.split(',').map(chip => chip.trim()).filter(Boolean);
      chips.forEach(chip => addChip(chip));
      setInputValue('');
    } else {
      setInputValue(newValue);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      
      <div className={`min-h-[44px] w-full rounded-lg border border-border bg-input p-2 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 ${
        error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500' : ''
      }`}>
        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((chip, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground text-sm rounded-md"
            >
              {chip}
              <button
                type="button"
                onClick={() => removeChip(index)}
                className="hover:bg-accent/80 rounded-sm p-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-accent-foreground"
                aria-label={`Remove ${chip}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        
        {/* Input */}
        {value.length < maxChips && (
          <input
            id={inputId}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ''}
            className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : help ? `${inputId}-help` : undefined
            }
          />
        )}
      </div>
      
      {help && !error && (
        <p id={`${inputId}-help`} className="text-sm text-muted-foreground">
          {help} {value.length > 0 && `(${value.length}/${maxChips})`}
        </p>
      )}
      
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
