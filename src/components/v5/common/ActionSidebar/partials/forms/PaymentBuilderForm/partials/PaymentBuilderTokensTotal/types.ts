import { type Token } from '~types/graphql.ts';

export interface PaymentBuilderTokenItem extends Token {
  amount: string;
}

export interface PaymentBuilderTokensTotalProps {
  tokens: PaymentBuilderTokenItem[];
}
