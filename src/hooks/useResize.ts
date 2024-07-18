import { useEffect } from 'react';

export const useResize = (callback: () => void) => {
  useEffect(() => {
    callback();

    window.addEventListener('resize', callback);

    return () => window.removeEventListener('resize', callback);
  }, [callback]);
};
