import { NETWORK_DATA } from '~constants';

export const getChainIconName = (
  chainId: number | undefined,
): string | undefined =>
  Object.values(NETWORK_DATA).find(({ chainId: id }) => id === chainId)
    ?.iconName;
