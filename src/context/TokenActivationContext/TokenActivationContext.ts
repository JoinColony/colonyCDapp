import { createContext, useContext } from 'react';

export const TokenActivationContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export const useTokenActivationContext = () => {
  const context = useContext(TokenActivationContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "TokenActivationContext" provider',
    );
  }

  return context;
};
