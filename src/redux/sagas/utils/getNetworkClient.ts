import { call } from 'redux-saga/effects';
import {
  getColonyNetworkClient,
  Network,
  ColonyNetworkAddress,
} from '@colony/colony-js';
import { EthersSigner } from '@purser/signer-ethers';

import { Signer } from 'ethers';
import { DEFAULT_NETWORK } from '~constants';
import { ContextModule, getContext } from '~context';

import getProvider from './getProvider';

/*
 * Return an initialized ColonyNetworkClient instance.
 */
export default function* getNetworkClient() {
  const wallet = getContext(ContextModule.Wallet);

  if (!wallet) throw new Error('No wallet in context');

  const network = DEFAULT_NETWORK as Network;

  const provider = getProvider();

  const signer = new EthersSigner({ purserWallet: wallet, provider });

  let reputationOracleUrl = new URL(`/reputation`, window.location.origin);

  if (
    process.env.NODE_ENV === 'development' &&
    DEFAULT_NETWORK === Network.Custom
  ) {
    reputationOracleUrl = new URL(`/reputation`, 'http://localhost:3001');
    const {
      etherRouterAddress: networkAddress,
      // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, import/no-dynamic-require
    } = require('../../../../amplify/mock-data/colonyNetworkArtifacts/etherrouter-address.json');
    return yield call(
      getColonyNetworkClient,
      network,
      signer as unknown as Signer,
      {
        networkAddress,
        reputationOracleEndpoint: reputationOracleUrl.href,
      },
    );
  }

  return yield call(
    getColonyNetworkClient,
    network,
    signer as unknown as Signer,
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
