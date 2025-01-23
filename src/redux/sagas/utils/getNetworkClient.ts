import {
  getColonyNetworkClient,
  ColonyNetworkAddress,
  Network as ColonyJSNetwork,
} from '@colony/colony-js';

import { DEFAULT_NETWORK } from '~constants/index.ts';
import { ContextModule, getContext } from '~context/index.ts';
import { ColonyJSNetworkMapping, Network } from '~types/network.ts';

import type { SignerOrProvider } from '@colony/colony-js';

/*
 * Return an initialized ColonyNetworkClient instance.
 */
const getNetworkClient = async (signerOrProvider?: SignerOrProvider) => {
  const wallet = getContext(ContextModule.Wallet);

  const network = DEFAULT_NETWORK;

  const signer = signerOrProvider || wallet.ethersProvider.getSigner();

  const reputationOracleUrl = import.meta.env.REPUTATION_ORACLE_ENDPOINT
    ? new URL(import.meta.env.REPUTATION_ORACLE_ENDPOINT)
    : new URL(`/reputation`, window.location.origin);

  const ganacheAccountsUrl = new URL(
    import.meta.env.VITE_NETWORK_FILES_ENDPOINT || 'http://localhost:3006',
  );

  if (import.meta.env.DEV && import.meta.env.NETWORK_ID === Network.Ganache) {
    const fetchRes = await fetch(
      `${ganacheAccountsUrl.href}etherrouter-address.json`,
    );
    const { etherRouterAddress: networkAddress } = await fetchRes.json();

    return getColonyNetworkClient(ColonyJSNetwork.Custom, signer, {
      networkAddress,
      reputationOracleEndpoint: reputationOracleUrl.href,
      disableVersionCheck: true,
    });
  }

  return getColonyNetworkClient(
    ColonyJSNetworkMapping[network] as ColonyJSNetwork,
    signer,
    {
      /*
       * Manually set the network address to instantiate the network client
       * This is usefull for networks where we have two deployments (like xDAI)
       * and we want to be able to differentiate between them
       */
      networkAddress:
        import.meta.env.NETWORK_CONTRACT_ADDRESS ||
        ColonyNetworkAddress[network],
      reputationOracleEndpoint: reputationOracleUrl.href,
      disableVersionCheck: true,
    },
  );
};

export default getNetworkClient;
