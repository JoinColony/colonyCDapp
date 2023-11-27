import { useContext } from 'react';

import { TokenActivationContext } from '~shared/TokenActivationProvider';

const useTokenActivationContext = () => {
  const context = useContext(TokenActivationContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "TokenActivationContext" provider',
    );
  }

  return context;
};

export default useTokenActivationContext;
