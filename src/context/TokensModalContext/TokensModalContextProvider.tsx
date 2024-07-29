import { CoinVertical } from '@phosphor-icons/react';
import React, {
  type FC,
  type PropsWithChildren,
  useMemo,
  useState,
  useCallback,
} from 'react';

import useToggle from '~hooks/useToggle/index.ts';
import { TokensModalType } from '~v5/common/TokensModal/consts.ts';
import TokensModal from '~v5/common/TokensModal/index.ts';

import { TokensModalContext } from './TokensModalContext.ts';

const TokensModalContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [tokensModalType, setTokensModalType] = useState<TokensModalType>(
    TokensModalType.Activate,
  );
  const [
    isTokensModalOpen,
    { toggleOn: toggleOnTokensModal, toggleOff: toggleOffTokensModal },
  ] = useToggle();

  const handleToggleOnModal = useCallback(
    (type: TokensModalType) => {
      toggleOnTokensModal();
      setTokensModalType(type);
    },
    [toggleOnTokensModal],
  );

  const value = useMemo(
    () => ({
      toggleOnTokensModal: handleToggleOnModal,
      isTokensModalOpen,
    }),
    [handleToggleOnModal, isTokensModalOpen],
  );

  return (
    <TokensModalContext.Provider value={value}>
      <TokensModal
        isOpen={isTokensModalOpen}
        onClose={toggleOffTokensModal}
        icon={CoinVertical}
        buttonMode="primarySolid"
        type={tokensModalType}
      />
      {children}
    </TokensModalContext.Provider>
  );
};

export default TokensModalContextProvider;
