import { useCallback } from 'react';

import { useMobile } from '~hooks';

import { useResize } from './useResize.ts';

interface PopperCustomPositioningProps<T, K> {
  triggerRef: React.RefObject<T>;
  menuRef: React.RefObject<K>;
  config: {
    skipDesktop?: boolean;
    keepInitialBottomPlacement?: boolean;
    offset?: {
      top: number;
      left: number;
    };
    useTriggerAsTranslateDefault?: boolean;
    hasLeftAlignment?: boolean;
  };
}

// @Note: this can be used also for MeatBallMenu component, but will require some testing and refactoring
export const usePopperCustomPositioning = <
  T extends HTMLElement,
  K extends HTMLElement,
>({
  triggerRef,
  menuRef,
  config: {
    skipDesktop,
    keepInitialBottomPlacement,
    offset = {
      top: 1.2,
      left: 1.2,
    },
    useTriggerAsTranslateDefault,
    hasLeftAlignment,
  },
}: PopperCustomPositioningProps<T, K>) => {
  const isMobile = useMobile();

  const trigger = triggerRef.current;
  const menu = menuRef.current;

  const adjustMenuPosition = useCallback(() => {
    if (!trigger || !menu) return;

    if (!isMobile && skipDesktop) return;

    const triggerPlacement = trigger.getBoundingClientRect();
    const leftOffset = window.innerWidth - triggerPlacement.x;
    const bottomOffset = window.innerHeight - triggerPlacement.y;
    let translateX = useTriggerAsTranslateDefault ? triggerPlacement.x : '0';
    let translateY = useTriggerAsTranslateDefault ? triggerPlacement.y : '0';

    if (!isMobile) {
      if (leftOffset < menu.clientWidth || hasLeftAlignment) {
        translateX = `calc(-100% + ${offset.left}rem)`;
      }
    } else {
      translateX = `calc(-100% + ${leftOffset}px - ${offset.left}rem)`;
    }

    if (bottomOffset < menu.clientHeight && !keepInitialBottomPlacement) {
      translateY = `calc(-100% - ${offset.top}rem)`;
    }

    menu.style.transform = `translate(${translateX}, ${translateY})`;
  }, [
    isMobile,
    trigger,
    menu,
    skipDesktop,
    offset,
    hasLeftAlignment,
    keepInitialBottomPlacement,
    useTriggerAsTranslateDefault,
  ]);

  useResize(adjustMenuPosition);

  // Separate dynamic styles and classes since tailwind doesn't support runtime values
  return {
    menuClassName: `left-0 sm:w-auto sm:min-w-fit`,
    menuStyle: isMobile
      ? {
          width: `calc(100vw - ${2 * offset.left}rem)`,
          minWidth: `calc(100vw - ${2 * offset.left}rem)`,
        }
      : {},
  };
};
