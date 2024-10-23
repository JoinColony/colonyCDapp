import { useEffect } from 'react';

interface UseTimeoutArgs {
  callback: () => void;
  shouldTriggerCallback?: boolean;
  miliseconds?: number;
}

export const useTimeout = ({
  callback,
  shouldTriggerCallback = true,
  miliseconds = 2_000,
}: UseTimeoutArgs) => {
  useEffect(() => {
    let timeoutId;
    if (shouldTriggerCallback) {
      timeoutId = setTimeout(callback, miliseconds);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    // We don't want the useEffect to retrigger if the callback function has been re-created
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldTriggerCallback, miliseconds]);
};
