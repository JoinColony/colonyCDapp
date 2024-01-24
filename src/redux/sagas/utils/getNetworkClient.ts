import {
  getColonyNetworkClient,
  ColonyNetworkAddress,
  Network as ColonyJSNetwork,
} from '@colony/colony-js';

import { DEFAULT_NETWORK } from '~constants';
import { ContextModule, getContext } from '~context';
import { ColonyJSNetworkMapping, Network } from '~types/network';
import { isFullWallet } from '~types/wallet';

/*
 * Return an initialized ColonyNetworkClient instance.
 */
const getNetworkClient = async () => {
  const wallet = getContext(ContextModule.Wallet);

  if (!isFullWallet(wallet)) {
    throw new Error('Background login not yet completed.');
  }

  const network = DEFAULT_NETWORK;

  const signer = wallet.ethersProvider.getSigner();

  const reputationOracleUrl = process.env.REPUTATION_ORACLE_ENDPOINT
    ? new URL(process.env.REPUTATION_ORACLE_ENDPOINT)
    : new URL(`/reputation`, window.location.origin);

  const ganacheAccountsUrl = new URL(
    process.env.GANACHE_ACCOUNTS_ENDPOINT || 'http://localhost:3006',
  );

  // @ts-ignore
  if (!WEBPACK_IS_PRODUCTION && process.env.NETWORK === Network.Ganache) {
    const fetchRes = await fetch(
      `${ganacheAccountsUrl.href}etherrouter-address.json`,
    );
    const { etherRouterAddress: networkAddress } = await fetchRes.json();

    return getColonyNetworkClient(ColonyJSNetwork.Custom, signer, {
      networkAddress,
      reputationOracleEndpoint: reputationOracleUrl.href,
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
        process.env.NETWORK_CONTRACT_ADDRESS || ColonyNetworkAddress[network],
      reputationOracleEndpoint: reputationOracleUrl.href,
    },
  );
};

export default getNetworkClient;
