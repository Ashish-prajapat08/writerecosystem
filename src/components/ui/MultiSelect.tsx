import { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

interface MultiSelectProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({ options, selected, onChange, placeholder = 'Select...' }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter(item => item !== value));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="flex items-center justify-between w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {selected.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            selected.map(value => {
              const option = options.find(opt => opt.value === value);
              return (
                <span
                  key={value}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-800 rounded-full"
                >
                  {option?.label}
                  <X
                    className="w-3 h-3 text-gray-400 hover:text-white"
                    onClick={(e) => removeOption(value, e)}
                  />
                </span>
              );
            })
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map(option => (
            <div
              key={option.value}
              className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-800 ${selected.includes(option.value) ? 'bg-blue-900/20' : ''}`}
              onClick={() => toggleOption(option.value)}
            >
              <span>{option.label}</span>
              {selected.includes(option.value) && <Check className="w-4 h-4 text-blue-400" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}