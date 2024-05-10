import { type PaymentBuilderRecipientsFieldModel } from '../PaymentBuilderRecipientsField/types.ts';

export interface PaymentBuilderPayoutsTotalProps {
  data: PaymentBuilderRecipientsFieldModel[];
  moveDecimals?: boolean;
  itemClassName?: string;
  buttonClassName?: string;
}
