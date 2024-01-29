import React, {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';

import useToggle from '~hooks/useToggle/index.ts';
import noop from '~utils/noop.ts';
import TokensModal from '~v5/common/TokensModal/index.ts';
import { type TokensModalType } from '~v5/common/TokensModal/types.ts';

export const TokensModalContext = createContext<{
  toggleOnTokensModal: () => void;
  setTokensModalType: React.Dispatch<React.SetStateAction<TokensModalType>>;
  isTokensModalOpen: boolean;
}>({
  toggleOnTokensModal: noop,
  setTokensModalType: noop,
  isTokensModalOpen: false,
});

export const TokensModalContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [tokensModalType, setTokensModalType] =
    useState<TokensModalType>('activate');
  const [
    isTokensModalOpen,
    { toggleOn: toggleOnTokensModal, toggleOff: toggleOffTokensModal },
  ] = useToggle();

  const value = useMemo(
    () => ({
      toggleOnTokensModal,
      setTokensModalType,
      isTokensModalOpen,
    }),
    [toggleOnTokensModal, setTokensModalType, isTokensModalOpen],
  );

  return (
    <TokensModalContext.Provider value={value}>
      <TokensModal
        isOpen={isTokensModalOpen}
        onClose={toggleOffTokensModal}
        icon="coin-vertical"
        buttonMode="primarySolid"
        type={tokensModalType}
      />
      {children}
    </TokensModalContext.Provider>
  );
};

export const useTokensModalContext = () => useContext(TokensModalContext);
