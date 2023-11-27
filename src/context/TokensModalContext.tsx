import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import useToggle from '~hooks/useToggle';
import noop from '~utils/noop';
import TokensModal from '~v5/common/TokensModal';
import { TokensModalType } from '~v5/common/TokensModal/types';

export const TokensModalContext = createContext<{
  toggleOnTokensModal: () => void;
  setTokensModalType: React.Dispatch<React.SetStateAction<TokensModalType>>;
}>({ toggleOnTokensModal: noop, setTokensModalType: noop });

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
    }),
    [toggleOnTokensModal, setTokensModalType],
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
