import { type Icon } from '@phosphor-icons/react';

import { NETWORK_DATA } from '~constants/index.ts';

export const getChainIcon = (chainId: string | undefined): Icon | undefined =>
  Object.values(NETWORK_DATA).find(({ chainId: id }) => id === chainId)?.icon;
