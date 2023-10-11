import { ModalProps } from '../../types';
import { TOKENS_MODAL_TYPES } from './consts';

export type TokensModalType =
  (typeof TOKENS_MODAL_TYPES)[keyof typeof TOKENS_MODAL_TYPES];

export interface TokensModalProps extends ModalProps {
  type: TokensModalType;
}
