import { NETWORK_DATA, NetworkInfo } from '~constants';

import useAppContext from './useAppContext';

const useGetNetworkToken = (): NetworkInfo | undefined => {
  const { wallet } = useAppContext();

  if (!wallet) {
    return undefined;
  }

  const [{ id: walletHexChainId }] = wallet.chains;
  const userWalletChain = parseInt(walletHexChainId.slice(2), 16);

  const networkToken = Object.values(NETWORK_DATA).find(
    (network) => network.chainId === userWalletChain,
  );

  return networkToken;
};

export default useGetNetworkToken;
