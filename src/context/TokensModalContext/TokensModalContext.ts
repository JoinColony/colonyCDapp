import { createContext, useContext } from 'react';

import noop from '~utils/noop.ts';
import { type TokensModalType } from '~v5/common/TokensModal/consts.ts';

export const TokensModalContext = createContext<{
  toggleOnTokensModal: (type: TokensModalType) => void;
  isTokensModalOpen: boolean;
}>({
  toggleOnTokensModal: noop,
  isTokensModalOpen: false,
});

export const useTokensModalContext = () => useContext(TokensModalContext);
