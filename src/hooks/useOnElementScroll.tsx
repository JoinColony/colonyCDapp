import { noop } from 'lodash';
import { useEffect } from 'react';

/**
 * Hook to run a callback function when a specific element is scrolled.
 *
 * @param {string} scrollableElementId - The ID of the element to listen for scroll events.
 * @param {() => void} callback - The function to run on each scroll.
 * @param {boolean} [shouldExecute=true] - Whether to set up the scroll listener.
 *
 * @example
 * useOnElementScroll({
 *   scrollableElementId: 'content',
 *   callback: () => console.log('Scrolled!'),
 *   shouldExecute: true,
 * });
 */
export const useOnElementScroll = ({
  scrollableElementId,
  callback,
  shouldExecute = true,
}: {
  scrollableElementId: string;
  callback: () => void;
  shouldExecute?: boolean;
}) => {
  useEffect(() => {
    if (!shouldExecute) {
      return noop;
    }

    const scrollElement = document.getElementById(scrollableElementId);

    if (!scrollElement) {
      console.error(`Element with ID '${scrollableElementId}' not found`);
      return noop;
    }

    const handleScroll = () => callback();

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollElement?.removeEventListener('scroll', handleScroll);
    };
  }, [callback, scrollableElementId, shouldExecute]);
};
