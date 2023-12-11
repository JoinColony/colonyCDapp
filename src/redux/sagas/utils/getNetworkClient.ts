import {
  getColonyNetworkClient,
  ColonyNetworkAddress,
  Network as ColonyJSNetwork,
} from '@colony/colony-js';
import { providers } from 'ethers';

import axios from 'axios';
import { DEFAULT_NETWORK } from '~constants';
import { ContextModule, getContext } from '~context';
import { ColonyJSNetworkMapping, Network, isFullWallet } from '~types';

/*
 * Return an initialized ColonyNetworkClient instance.
 */
const getNetworkClient = async () => {
  const wallet = getContext(ContextModule.Wallet);

  if (!isFullWallet(wallet)) {
    throw new Error('Background login not yet completed.');
  }

  const network = DEFAULT_NETWORK;

  const walletProvider = new providers.Web3Provider(wallet.provider);

  const signer = walletProvider.getSigner();

  const reputationOracleUrl = process.env.REPUTATION_ORACLE_ENDPOINT
    ? new URL(process.env.REPUTATION_ORACLE_ENDPOINT)
    : new URL(`/reputation`, window.location.origin);

  // @ts-ignore
  if (!WEBPACK_IS_PRODUCTION && process.env.NETWORK === Network.Ganache) {
    const localOracle = new URL(`/reputation/local`, 'http://localhost:3001');

    const { etherRouterAddress: networkAddress } = (
      await axios.get('http://localhost:3006/etherrouter-address.json')
    ).data;

    return getColonyNetworkClient(ColonyJSNetwork.Custom, signer, {
      networkAddress,
      reputationOracleEndpoint: localOracle.href,
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
