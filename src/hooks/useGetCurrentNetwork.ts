import { type NetworkInfo } from '~constants/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { getChainIdFromHex } from '~utils/chainId.ts';
import { getNetworkByChainId } from '~utils/web3/index.ts';

const useGetCurrentNetwork = (): NetworkInfo | null => {
  const { wallet } = useAppContext();

  if (!wallet) {
    return null;
  }

  const [{ id: walletHexChainId }] = wallet.chains;
  const walletChainId = getChainIdFromHex(walletHexChainId);
  const networkInfo = getNetworkByChainId(walletChainId);

  return networkInfo;
};

export default useGetCurrentNetwork;
