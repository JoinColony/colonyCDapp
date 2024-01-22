import { NativeTokenStatus, TokenFragment } from '~gql';

export interface TokenAvatarProps {
  token: TokenFragment;
  isTokenNative: boolean;
  nativeTokenStatus?: NativeTokenStatus;
}
