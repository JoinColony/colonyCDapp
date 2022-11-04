import { Network } from '~types';

import { DEFAULT_NETWORK, NETWORK_DATA, SUPPORTED_NETWORKS } from '~constants';

export const checkIfNetworkIsAllowed = (
  walletNetworkId: number | null | undefined,
) => {
  const walletSupportedNetwork = SUPPORTED_NETWORKS[walletNetworkId || 1];
  const onLocalDevEnvironment = process.env.NETWORK === Network.Ganache;
  const currentNetworkData =
    NETWORK_DATA[process.env.NETWORK || DEFAULT_NETWORK];

  return (
    walletSupportedNetwork &&
    (walletSupportedNetwork.chainId === currentNetworkData.chainId ||
      onLocalDevEnvironment)
  );
};
