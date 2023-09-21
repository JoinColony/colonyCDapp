import { useLayoutEffect, useRef } from 'react';

export const useRelativePortalElement = <
  T extends HTMLElement,
  S extends HTMLElement,
>(
  deps: React.DependencyList = [],
  {
    bottomWindowPadding = 20,
    rightWindowPadding = 20,
    top = 0,
  }: {
    bottomWindowPadding?: number;
    rightWindowPadding?: number;
    top?: number;
  } = {},
) => {
  const relativeElementRef = useRef<T | null>(null);
  const portalElementRef = useRef<S | null>(null);

  useLayoutEffect(() => {
    const onScroll = () => {
      if (!relativeElementRef.current || !portalElementRef.current) {
        return;
      }

      const { bottom, left } =
        relativeElementRef.current.getBoundingClientRect();
      const leftPosition =
        portalElementRef.current.clientWidth + left + rightWindowPadding >
        window.innerWidth
          ? window.innerWidth -
            portalElementRef.current.clientWidth -
            rightWindowPadding
          : left;

      portalElementRef.current.style.top = `${bottom + window.scrollY + top}px`;
      portalElementRef.current.style.left = `${leftPosition}px`;
      portalElementRef.current.style.maxHeight = `${
        window.innerHeight - bottom - bottomWindowPadding
      }px`;
    };

    onScroll();

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightWindowPadding, bottomWindowPadding, top, ...deps]);

  return { relativeElementRef, portalElementRef };
};
