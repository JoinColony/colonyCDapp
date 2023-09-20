import { useLayoutEffect, useRef } from 'react';

export const useRelativePortalElement = <
  T extends HTMLElement,
  S extends HTMLElement,
>(
  deps: React.DependencyList = [],
) => {
  const relativeElementRef = useRef<T | null>(null);
  const portalElementRef = useRef<S | null>(null);

  useLayoutEffect(() => {
    const onScroll = () => {
      if (!relativeElementRef.current || !portalElementRef.current) {
        return;
      }

      portalElementRef.current.style.top = `${
        relativeElementRef.current.getBoundingClientRect().bottom +
        window.scrollY
      }px`;
      portalElementRef.current.style.left = `${
        relativeElementRef.current.getBoundingClientRect().left
      }px`;
      portalElementRef.current.style.maxHeight = `${
        window.innerHeight -
        relativeElementRef.current.getBoundingClientRect().bottom -
        20
      }px`;
    };

    onScroll();

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, deps);

  return { relativeElementRef, portalElementRef };
};
