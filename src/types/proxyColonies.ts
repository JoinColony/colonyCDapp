import { type Icon } from '@phosphor-icons/react';

export interface SupportedChain {
  name: string;
  chainId: number;
  icon: Icon;
  isDisabled?: boolean;
}
