import { type FieldValues } from 'react-hook-form';

import { type Action } from '~constants/actions.ts';
import { type ModalProps } from '~v5/shared/Modal/types.ts';

export interface CreateStakedExpenditureModalProps
  extends Pick<ModalProps, 'isOpen' | 'onClose'> {
  formValues: FieldValues;
  actionType: Action;
}

export interface CreateStakedExpenditureFormFields {
  stakeAmount: string;
  networkInverseFee: string;
  stakedExpenditureAddress: string;
  hasEnoughTokens: boolean;
}
