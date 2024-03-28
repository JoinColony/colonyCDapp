import { type NativeTokenStatus, type Token } from '~types/graphql.ts';

export interface TokenCellProps {
  token: Token;
  tokenAddress: string;
  nativeTokenStatus?: NativeTokenStatus | null;
}
