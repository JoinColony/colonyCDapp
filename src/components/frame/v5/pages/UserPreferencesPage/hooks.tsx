import { useLayoutEffect, useState } from 'react';

import { isFullScreen } from '~constants/index.ts';

export const useFullScreenMode = () => {
  const [isFullScreenMode, setIsFullScreenMode] = useState(false);

  useLayoutEffect(() => {
    setIsFullScreenMode(localStorage.getItem(isFullScreen) === 'true');
  }, []);

  const toggleFullScreenMode = () => {
    // Keep localStorage in sync with toggle state
    if (isFullScreenMode) {
      localStorage.setItem(isFullScreen, 'false');
      setIsFullScreenMode(false);
    } else {
      localStorage.setItem(isFullScreen, 'true');
      setIsFullScreenMode(true);
    }
  };

  return { isFullScreenMode, toggleFullScreenMode };
};
