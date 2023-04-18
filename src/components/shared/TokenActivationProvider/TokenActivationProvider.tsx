import React, { createContext, useState, ReactNode } from 'react';

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

  const value = React.useMemo(
    () => ({
      isOpen,
      setIsOpen,
    }),
    [isOpen],
  );

  return <TokenActivationContext.Provider value={value}>{children}</TokenActivationContext.Provider>;
};

export default TokenActivationProvider;
