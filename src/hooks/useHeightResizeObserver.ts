import { useEffect } from 'react';

import { type CSSCustomVariable } from '~constants/cssCustomVariables.ts';

export const useHeightResizeObserver = <T extends HTMLElement | null>(
  ref: React.MutableRefObject<T>,
  cssVar: CSSCustomVariable,
) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const updateHeight = ([entry]: ResizeObserverEntry[]) => {
      const { height } = entry.contentRect;
      document.body.style.setProperty(cssVar, `${height}px`);
    };

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, cssVar]);
};
