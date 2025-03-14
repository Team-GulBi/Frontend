import { ChangeEvent, useEffect, useState } from "react";

interface TagInputProps {
    onTagsChange: (tags: string) => void;
    initialTags?: string;
  }
  
  export const TagInput = ({ onTagsChange, initialTags }: TagInputProps) => {
    const [inputValue, setInputValue] = useState('');
    const [tags, setTags] = useState<string[]>([]);
  
    useEffect(() => {
      if (initialTags) {
        setTags(initialTags.split(",").map(tag => tag.trim()));
      }
    }, [initialTags]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };
  
    const handleAddTag = () => {
      const trimmedValue = inputValue.trim();
      if (trimmedValue && !tags.includes(`#${trimmedValue}`) && tags.length < 6) {
        const newTag = `#${trimmedValue}`;
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        onTagsChange(updatedTags.join(','));
        setInputValue('');
      }
    };
  
    const handleRemoveTag = (tagToRemove: string) => {
      const updatedTags = tags.filter((tag) => tag !== tagToRemove);
      setTags(updatedTags);
      onTagsChange(updatedTags.join(','));
    };
  
    return (
      <div className="flex flex-col gap-4 px-[1rem]">
        <span className="text-medium18 text-neutral-0">태그</span>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center rounded-md bg-neutral-100 px-2 py-1 text-neutral-0"
            >
              <span>{tag}</span>
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 text-secondary-40"
              >
                ×
              </button>
            </div>
          ))}
          {tags.length < 6 && (
            <div className="flex items-center">
              <input
                className="font-regular rounded-xs border border-neutral-80 bg-neutral-100 px-[0.75rem] py-[0.75rem] text-small16 text-neutral-0 focus:outline-none"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="태그 입력"
              />
              <button
                onClick={handleAddTag}
                className="ml-2 h-full rounded-md bg-secondary-100 px-4 text-white"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };