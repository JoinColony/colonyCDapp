import { useRef } from 'react';

export const useScrollIntoView = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  const scroll = (options: ScrollIntoViewOptions) => {
    if (ref.current) {
      ref.current.scrollIntoView({ ...options });
    }
  };

  return { ref, scroll };
};
