import { throttle } from 'lodash';
import { useEffect } from 'react';

export const useResize = (callback: () => void, wait: number = 200) => {
  useEffect(() => {
    const throttledCallback = throttle(callback, wait);

    throttledCallback();

    window.addEventListener('resize', throttledCallback);

    return () => {
      window.removeEventListener('resize', throttledCallback);
      throttledCallback.cancel();
    };
  }, [callback, wait]);
};
