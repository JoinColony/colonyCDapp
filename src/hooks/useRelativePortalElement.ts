import { useLayoutEffect, useRef } from 'react';

const useRelativePortalElement = <T extends HTMLElement, S extends HTMLElement>(
  deps: React.DependencyList = [],
  {
    bottomWindowPadding = 20,
    rightWindowPadding = 20,
    top = 0,
    customLeftPosition = 0,
    withAutoTopPlacement = false,
    withMaxHeight = true,
    withLeftPosition = true,
  }: {
    bottomWindowPadding?: number;
    rightWindowPadding?: number;
    top?: number;
    withAutoTopPlacement?: boolean;
<<<<<<< HEAD
    customLeftPosition?: number;
=======
    withMaxHeight?: boolean;
    withLeftPosition?: boolean;
>>>>>>> a8c292ff3 (feat: implement verified members form)
  } = {},
) => {
  const relativeElementRef = useRef<T | null>(null);
  const portalElementRef = useRef<S | null>(null);

  useLayoutEffect(() => {
    const onScroll = () => {
      if (!relativeElementRef.current || !portalElementRef.current) {
        return;
      }

      const {
        bottom,
        top: relativeElementTop,
        left,
      } = relativeElementRef.current.getBoundingClientRect();
      const { height: dropdownHeight } =
        portalElementRef.current.getBoundingClientRect();

      const shouldShowOnTop =
        withAutoTopPlacement &&
        window.innerHeight - bottom - dropdownHeight < 0;

      const leftPosition =
        portalElementRef.current.clientWidth + left + rightWindowPadding >
        window.innerWidth
          ? window.innerWidth -
            portalElementRef.current.clientWidth -
            rightWindowPadding
          : left;

<<<<<<< HEAD
      portalElementRef.current.style.left = `${
        leftPosition + customLeftPosition
      }px`;
=======
      if (withLeftPosition) {
        portalElementRef.current.style.left = `${leftPosition}px`;
      }
>>>>>>> a8c292ff3 (feat: implement verified members form)
      if (shouldShowOnTop) {
        portalElementRef.current.style.top = `${
          relativeElementTop + window.scrollY - top - dropdownHeight
        }px`;
      } else {
        portalElementRef.current.style.top = `${
          bottom + window.scrollY + top
        }px`;
        if (withMaxHeight) {
          portalElementRef.current.style.maxHeight = `${
            window.innerHeight - bottom - bottomWindowPadding
          }px`;
        }
      }
    };

    onScroll();

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightWindowPadding, bottomWindowPadding, top, ...deps]);

  return { relativeElementRef, portalElementRef };
};

export default useRelativePortalElement;
