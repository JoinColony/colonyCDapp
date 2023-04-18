import { useContext } from 'react';

import { ColonyContext } from '~context';

const useColonyContext = () => {
  const context = useContext(ColonyContext);

  if (!context) {
    throw new Error('This hook must be used within the "ColonyContext" provider');
  }

  return context;
};

export default useColonyContext;
