import React, { createContext, useState, ReactNode, useMemo } from 'react';

export const TokenActivationContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

interface Props {
  children: ReactNode;
}

const TokenActivationProvider = ({ children }: Props) => {
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

export default TokenActivationProvider;
