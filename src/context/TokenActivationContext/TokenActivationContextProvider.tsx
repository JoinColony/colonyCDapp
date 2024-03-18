import React, {
  useState,
  useMemo,
  type FC,
  type PropsWithChildren,
} from 'react';

import { TokenActivationContext } from './TokenActivationContext.ts';

export const TokenActivationProvider: FC<PropsWithChildren> = ({
  children,
}) => {
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
