import { useEffect } from 'react';

export const useOnClickOutside = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  action: () => void,
) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      action();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [action, ref]);
};
