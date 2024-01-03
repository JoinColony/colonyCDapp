import { ObjectSchema } from 'yup';

import { ActionTypes } from '~redux';
import { Token } from '~types';

import { ModalProps } from '../../shared/Modal/types';

import { TOKENS_MODAL_TYPES } from './consts';

export type TokensModalType =
  (typeof TOKENS_MODAL_TYPES)[keyof typeof TOKENS_MODAL_TYPES];

export interface TokensModalProps extends ModalProps {
  type: TokensModalType;
}

export interface UseTokensModalReturnType {
  validationSchema: ObjectSchema<
    object & {
      amount: string;
    },
    object
  >;
  actionType: ActionTypes;
  transform: (...args: any[]) => any;
  tokenBalanceData?: string | null;
  tokenDecimals: number;
  nativeToken?: Token;
  tokenSymbol?: string;
  pollActiveTokenBalance: () => void;
  tokenBalanceInEthers: string;
  loading: boolean;
}
