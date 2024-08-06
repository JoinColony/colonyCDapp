import { useEffect } from 'react';

import { type CSSCustomVariable } from '~constants/cssCustomVariables.ts';

export const useHeightResizeObserver = <T extends HTMLElement | null>(
  ref: React.MutableRefObject<T>,
  cssVar: CSSCustomVariable,
) => {
  useEffect(() => {
    if (!ref?.current) {
      return undefined;
    }

    const observer = new ResizeObserver(([topContainer]) => {
      const {
        contentRect: { height },
      } = topContainer;

      document.body.style.setProperty(cssVar, `${height}px`);
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [cssVar, ref]);
};
