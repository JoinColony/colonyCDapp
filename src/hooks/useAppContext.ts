import { useContext } from 'react';

import { AppContext } from '~context';

const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('This hook must be used within the "AppContext" provider');
  }

  return context;
};

export default useAppContext;
