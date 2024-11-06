import { useEffect } from 'react';

export const useMobileMenuPosition = ({
  isMobile,
  hasLeftAlignment,
  triggerRef,
  menuRef,
}: {
  isMobile: boolean;
  hasLeftAlignment: boolean;
  triggerRef: React.RefObject<HTMLButtonElement>;
  menuRef: React.RefObject<HTMLDivElement>;
}) => {
  useEffect(() => {
    const adjustMenuPosition = () => {
      const trigger = triggerRef.current;
      const menu = menuRef.current;

      if (!trigger || !menu) return;

      const triggerPlacement = trigger.getBoundingClientRect();
      const leftOffset = window.innerWidth - triggerPlacement.x;
      const bottomOffset = window.innerHeight - triggerPlacement.y;
      let translateX = '0';
      let translateY = '0';

      if (!isMobile) {
        if (leftOffset < menu.clientWidth || hasLeftAlignment) {
          translateX = 'calc(-100% + 1.2rem)';
        }
      } else {
        translateX = `calc(-100% + ${leftOffset}px - 1.2rem)`;
      }

      if (bottomOffset < menu.clientHeight) {
        translateY = 'calc(-100% - 1.2rem)';
      }

      menu.style.transform = `translate(${translateX}, ${translateY})`;
    };

    adjustMenuPosition();

    window.addEventListener('resize', adjustMenuPosition);
    return () => window.removeEventListener('resize', adjustMenuPosition);
  }, [isMobile, triggerRef.current, menuRef.current]);
};
