import { useCallback, useRef } from 'react';

export const useScrollIntoView = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  const scroll = useCallback((options: ScrollIntoViewOptions) => {
    if (ref.current) {
      ref.current.scrollIntoView({ ...options });
    }
  }, []);

  return { ref, scroll };
};
