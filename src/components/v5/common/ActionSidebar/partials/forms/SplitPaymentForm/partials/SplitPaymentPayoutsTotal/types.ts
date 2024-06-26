import { type Token } from '~types/graphql.ts';

import { type SplitPaymentRecipientsFieldModel } from '../SplitPaymentRecipientsField/types.ts';

export interface SplitPaymentPayoutsTotalProps {
  data: SplitPaymentRecipientsFieldModel[];
  token: Token;
  moveDecimals?: boolean;
  className?: string;
}
