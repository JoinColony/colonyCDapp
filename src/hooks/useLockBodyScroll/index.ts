import { useEffect } from 'react';

/**
 * This hook locks or unlocks body scroll based on the given boolean flag.
 * It is a very simplified version of the `useDisableBodyScroll` hook.
 *
 * @param {boolean} [shouldLock=true] - Determines whether to lock the body scroll or not. Defaults to true.
 *
 * @description
 * This hook manages the document's body scroll by setting the `overflow` style to `'hidden'` when the
 * `shouldLock` flag is true and restoring the original overflow style when it's false or on cleanup.
 *
 * @note
 * It is still recommended to use the `useDisableBodyScroll` hook for most use cases.
 */
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
