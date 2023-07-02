import { call } from 'redux-saga/effects';
import {
  getColonyNetworkClient,
  ColonyNetworkAddress,
  Network as ColonyJSNetwork,
} from '@colony/colony-js';
import { providers } from 'ethers';

import { DEFAULT_NETWORK } from '~constants';
import { ContextModule, getContext } from '~context';
import { ColonyJSNetworkMapping, Network, isFullWallet } from '~types';

/*
 * Return an initialized ColonyNetworkClient instance.
 */
export default function* getNetworkClient() {
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
    const {
      etherRouterAddress: networkAddress,
      // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, import/no-dynamic-require
    } = require('../../../../amplify/mock-data/colonyNetworkArtifacts/etherrouter-address.json');
    return yield call(getColonyNetworkClient, ColonyJSNetwork.Custom, signer, {
      networkAddress,
      reputationOracleEndpoint: localOracle.href,
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
