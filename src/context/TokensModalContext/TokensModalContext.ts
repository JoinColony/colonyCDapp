import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
} from 'react';

import { noop } from '~utils/noop.ts';
import { type TokensModalType } from '~v5/common/TokensModal/consts.ts';

export const TokensModalContext = createContext<{
  toggleOnTokensModal: () => void;
  setTokensModalType: Dispatch<SetStateAction<TokensModalType>>;
  isTokensModalOpen: boolean;
}>({
  toggleOnTokensModal: noop,
  setTokensModalType: noop,
  isTokensModalOpen: false,
});

export const useTokensModalContext = () => useContext(TokensModalContext);
