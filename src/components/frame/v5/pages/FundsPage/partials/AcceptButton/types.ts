import { type ActionTypes } from '~redux/actionTypes.ts';
import { type ButtonProps } from '~v5/shared/Button/types.ts';

export interface AcceptButtonProps extends ButtonProps {
  tokenAddresses: string[];
  chainId?: string;
  actionType?: ActionTypes.CLAIM_TOKEN | ActionTypes.PROXY_COLONY_CLAIM_TOKEN;
}
