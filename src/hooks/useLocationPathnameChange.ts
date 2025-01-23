import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useLocationPathnameChange = (callback) => {
  const location = useLocation();
  useEffect(() => {
    callback();
    // We want to react only to location pathname changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
};

export default useLocationPathnameChange;
