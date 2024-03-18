import { type Token } from '~types/graphql.ts';

export interface PaymentBuilderPayoutItem extends Token {
  amount: string;
}

export interface PaymentBuilderPayoutsTotalProps {
  payouts: PaymentBuilderPayoutItem[];
}
