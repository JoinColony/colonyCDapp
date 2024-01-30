import { type NativeTokenStatus, type TokenFragment } from '~gql';

export interface TokenAvatarProps {
  token: TokenFragment;
  tokenAddress: string;
  nativeTokenStatus: NativeTokenStatus;
}
