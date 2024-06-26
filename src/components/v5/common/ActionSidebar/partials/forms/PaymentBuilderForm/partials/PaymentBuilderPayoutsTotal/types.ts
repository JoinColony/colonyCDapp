import { type PaymentBuilderRecipientsFieldModel } from '../PaymentBuilderRecipientsField/types.ts';

export interface PaymentBuilderPayoutsTotalProps {
  data: PaymentBuilderRecipientsFieldModel[];
  convertToWEI?: boolean;
  itemClassName?: string;
  buttonClassName?: string;
}
