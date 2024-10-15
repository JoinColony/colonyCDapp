import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useLocationChange = (callback) => {
  const location = useLocation();
  useEffect(() => {
    callback();
    // We want to react only to location changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
};

export default useLocationChange;
