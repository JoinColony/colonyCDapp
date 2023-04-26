import { useEffect, useState } from 'react';

type WindowDimensions = {
  width: number;
  height: number;
};

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowDimensions>();

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width: windowSize?.width as number,
    height: windowSize?.height as number,
  };
};

export default useWindowSize;
