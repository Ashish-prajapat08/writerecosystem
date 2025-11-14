// components/ui/tag-input.tsx
import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

type TagInputProps = {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
};

export const TagInput = ({ 
  tags, 
  onTagsChange, 
  placeholder = 'Add tags...',
  maxTags = 5
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = inputValue.trim();
    if (tag && !tags.includes(tag)) {
      if (maxTags && tags.length >= maxTags) return;
      onTagsChange([...tags, tag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="border rounded-md p-2 bg-background">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 text-blue-500 hover:text-blue-700"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={placeholder}
        className="w-full p-2 border-0 focus:ring-0 focus:outline-none bg-transparent text-sm text-white-800"
        disabled={maxTags ? tags.length >= maxTags : false}
      />
    </div>
  );
};