import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useLocationKeyChange = (callback: VoidFunction) => {
  const location = useLocation();
  useEffect(() => {
    callback();
    // We want to react only to location key changes, as in when the location history changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);
};

export default useLocationKeyChange;
