import { useMemo } from 'react';

const useSeperateTags = (tagString?: string) => {
  return useMemo(() => {
    if (!tagString) return [];
    return tagString.split(',').map(tag => tag.trim()); 
  }, [tagString]);
};

export default useSeperateTags;