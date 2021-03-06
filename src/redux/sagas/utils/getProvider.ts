import { Provider } from '@ethersproject/providers';
import { Network } from '@colony/colony-js';

import { ExtendedInfuraProvider } from './extendedInfuraProvider';
import { ExtendedJsonRpcProvider } from './extendedJsonRpcProvider';

import { DEFAULT_NETWORK } from '~constants';

/*
 * Return an initialized Provider instance.
 */
const getProvider = (): Provider => {
  const network = DEFAULT_NETWORK as Network;

  if (network === Network.Custom) {
    return new ExtendedJsonRpcProvider();
  }
  if (network === Network.Xdai) {
    return new ExtendedJsonRpcProvider(process.env.RPC_URL);
  }
  if (network === Network.XdaiQa) {
    return new ExtendedJsonRpcProvider(process.env.RPC_URL);
  }
  return new ExtendedInfuraProvider(network, process.env.INFURA_ID);
};

export default getProvider;
