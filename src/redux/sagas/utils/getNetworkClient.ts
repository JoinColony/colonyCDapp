import { call } from 'redux-saga/effects';
import {
  getColonyNetworkClient,
  ColonyNetworkAddress,
  Network as ColonyJSNetwork,
} from '@colony/colony-js';
import { providers } from 'ethers';

import { DEFAULT_NETWORK } from '~constants';
import { ContextModule, getContext } from '~context';
import { Network, ColonyJSNetworkMapping } from '~types';

/*
 * Return an initialized ColonyNetworkClient instance.
 */
export default function* getNetworkClient() {
  const wallet = getContext(ContextModule.Wallet);

  if (!wallet) throw new Error('No wallet in context');

  const network = DEFAULT_NETWORK;

  const walletProvider = new providers.Web3Provider(wallet.provider);

  const signer = walletProvider.getSigner();

  let reputationOracleUrl = new URL(`/reputation`, window.location.origin);

  if (DEFAULT_NETWORK === Network.Ganache) {
    reputationOracleUrl = new URL(`/reputation`, 'http://localhost:3001');
    const {
      etherRouterAddress: networkAddress,
      // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, import/no-dynamic-require
    } = require('../../../../amplify/mock-data/colonyNetworkArtifacts/etherrouter-address.json');
    return yield call(getColonyNetworkClient, ColonyJSNetwork.Custom, signer, {
      networkAddress,
      reputationOracleEndpoint: reputationOracleUrl.href,
    });
  }

  return yield call(
    getColonyNetworkClient,
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
}
