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
import TokensModal from '~v5/shared/Modal/partials/TokensModal';
import { TokensModalType } from '~v5/shared/Modal/partials/TokensModal/types';

export const TokensModalContext = createContext<{
  toggleOnTeamSelect: () => void;
  setTokensModalType: React.Dispatch<React.SetStateAction<TokensModalType>>;
}>({ toggleOnTeamSelect: noop, setTokensModalType: noop });

export const TokensModalContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [tokensModalType, setTokensModalType] =
    useState<TokensModalType>('activate');
  const [
    isTeamSelectVisible,
    { toggleOn: toggleOnTeamSelect, toggleOff: toggleTeamSelectOff },
  ] = useToggle();

  const value = useMemo(
    () => ({
      toggleOnTeamSelect,
      setTokensModalType,
    }),
    [toggleOnTeamSelect, setTokensModalType],
  );

  return (
    <TokensModalContext.Provider {...{ value }}>
      <TokensModal
        isOpen={isTeamSelectVisible}
        onClose={toggleTeamSelectOff}
        icon="coin-vertical"
        buttonMode="primarySolid"
        type={tokensModalType}
      />
      {children}
    </TokensModalContext.Provider>
  );
};

export const useTokensModalContext = () => useContext(TokensModalContext);
