import { useCallback, useState } from 'react';

export const useHover = () => {
  const [isHovered, setIsHovered] = useState(false);

  const toggleHover = useCallback((hasHover) => setIsHovered(hasHover), []);

  return {
    isHovered,
    toggleHover,
  };
};
