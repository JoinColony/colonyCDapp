import { useCallback, useState } from 'react';

const useHover = () => {
  const [isHovered, setIsHovered] = useState(false);

  const toggleHover = useCallback((hasHover) => setIsHovered(hasHover), []);

  return {
    isHovered,
    toggleHover,
  };
};

export default useHover;
