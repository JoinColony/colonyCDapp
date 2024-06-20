import { type FieldValues } from 'react-hook-form';

import { type ModalProps } from '~v5/shared/Modal/types.ts';

import { type PaymentBuilderFormValues } from '../forms/PaymentBuilderForm/hooks.ts';

export interface CreateStakedExpenditureModalProps
  extends Pick<ModalProps, 'isOpen' | 'onClose'> {
  formValues: FieldValues;
}

export interface CreateStakedExpenditureFormFields
  extends PaymentBuilderFormValues {
  stakeAmount: string;
  networkInverseFee: string;
  stakedExpenditureAddress: string;
  hasEnoughTokens: boolean;
}
