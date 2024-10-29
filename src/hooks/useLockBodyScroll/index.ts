import { useEffect } from 'react';

export const useLockBodyScroll = (shouldLock: boolean = true) => {
  useEffect(() => {
    const { body } = document;

    // Keep track of the body's overflow style, before attempting to update it
    const originalStyle = window.getComputedStyle(body).overflow;

    if (shouldLock) {
      body.style.overflow = 'hidden';
    } else {
      // Revert back to the original overflow style when shouldLock is false
      body.style.overflow = originalStyle;
    }

    // Cleanup function to restore the original style when the component unmounts
    return () => {
      body.style.overflow = originalStyle;
    };
  }, [shouldLock]);
};
