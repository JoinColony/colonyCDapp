import { useLayoutEffect, useRef } from 'react';

export const useRelativePortalElement = <
  T extends HTMLElement,
  S extends HTMLElement,
>(
  deps: React.DependencyList = [],
  {
    bottomPadding = 20,
    rightPadding = 20,
  }: { bottomPadding?: number; rightPadding?: number } = {},
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
        portalElementRef.current.clientWidth + left + rightPadding >
        window.innerWidth
          ? window.innerWidth -
            portalElementRef.current.clientWidth -
            rightPadding
          : left;

      portalElementRef.current.style.top = `${bottom + window.scrollY}px`;
      portalElementRef.current.style.left = `${leftPosition}px`;
      portalElementRef.current.style.maxHeight = `${
        window.innerHeight - bottom - bottomPadding
      }px`;
    };

    onScroll();

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightPadding, bottomPadding, ...deps]);

  return { relativeElementRef, portalElementRef };
};
