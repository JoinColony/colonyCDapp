import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';

const TokenActivationContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

interface Props {
  children: ReactNode;
}

export const TokenActivationProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      isOpen,
      setIsOpen,
    }),
    [isOpen, setIsOpen],
  );

  return (
    <TokenActivationContext.Provider value={value}>
      {children}
    </TokenActivationContext.Provider>
  );
};

export const useTokenActivationContext = () => {
  const context = useContext(TokenActivationContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "TokenActivationContext" provider',
    );
  }

  return context;
};
