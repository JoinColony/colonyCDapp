import { Network } from '~types';

import { DEFAULT_NETWORK, NETWORK_DATA } from '~constants';

export const checkIfNetworkIsAllowed = (
  walletNetworkId: number | null | undefined,
) => {
  const walletSupportedNetwork = NETWORK_DATA[walletNetworkId || 1];
  const onLocalDevEnvironment = process.env.NETWORK === Network.Ganache;
  const currentNetworkData =
    NETWORK_DATA[process.env.NETWORK || DEFAULT_NETWORK];

  return (
    walletSupportedNetwork &&
    (walletSupportedNetwork.chainId === currentNetworkData.chainId ||
      onLocalDevEnvironment)
  );
};
