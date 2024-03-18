import { type TokenType } from '~gql';
import { type ExpenditureSlot } from '~types/graphql.ts';

export interface PaymentBuilderTableProps {
  items: ExpenditureSlot[];
}

export interface AmountProps {
  amount: string;
  token: string;
}

export interface PaymentBuilderTableModel {
  key: React.Key;
  recipient: string;
  amount: AmountProps[];
  claimDelay: string;
}

export interface RecipientFieldProps {
  address: string;
}

export interface SelectedTokensProps {
  amount: string;
  decimals: number;
  name: string;
  symbol: string;
  type?: TokenType | null | undefined;
  avatar?: string | null | undefined;
  thumbnail?: string | null | undefined;
  tokenAddress: string;
}
