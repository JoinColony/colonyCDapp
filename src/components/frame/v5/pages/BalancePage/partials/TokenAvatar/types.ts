import { type NativeTokenStatus, type Token } from '~types/graphql.ts';

export interface TokenAvatarProps {
  token: Token;
  tokenAddress: string;
  nativeTokenStatus?: NativeTokenStatus | null;
}
