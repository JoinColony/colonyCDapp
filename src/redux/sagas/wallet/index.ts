// import { eventChannel } from 'redux-saga';

import Onboard, { ConnectOptions } from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';

import colonyIcon from '~images/icons/colony-logo.svg';
import { GANACHE_NETWORK, TOKEN_DATA, GANACHE_LOCAL_RPC_URL, isDev } from '~constants';

import ganacheModule from './ganacheModule';

import { private_keys as ganachePrivateKeys } from '../../../../amplify/mock-data/colonyNetworkArtifacts/ganache-accounts.json';

// import {
//   create as createSoftwareWallet,
//   open as purserOpenSoftwareWallet,
// } from '@purser/software';
// import { addChain } from '@purser/metamask/lib-esm/helpers';

import { setLastWallet, getLastWallet } from '~utils/autoLogin';

// import { ActionTypes } from '../../actionTypes';
// import { Action, AllActions } from '../../types/actions';
import { Network, DevelopmentWallets } from '~types';
// import { createAddress } from '~utils/web3';
// import { DEFAULT_NETWORK, NETWORK_DATA, TOKEN_DATA } from '~constants';

const injected = injectedModule();
const ganache = isDev
  ? Object.values(ganachePrivateKeys)
      .map((privateKey, index) => ganacheModule(privateKey, index + 1))
      /*
       * Remove the wallets used by the reputation miner and the block ingestor
       * As to not cause any "unplesantness"
       */
      .slice(0, -2)
  : [];

const onboard = Onboard({
  wallets: [injected, ...ganache],
  /*
   * @TODO This needs to be set up properly for other networks as well
   */
  chains: [
    {
      /*
       * chain id for @web3-onboard needs to be expressed as a hex string
       */
      id: `0x${GANACHE_NETWORK.chainId.toString(16)}`,
      token: TOKEN_DATA[Network.Ganache].symbol,
      label: DevelopmentWallets.Ganache,
      rpcUrl: GANACHE_LOCAL_RPC_URL,
    },
  ],
  accountCenter: {
    desktop: { enabled: false },
    mobile: { enabled: false },
  },
  connect: {
    showSidebar: false,
  },
  notify: {
    desktop: { enabled: false, transactionHandler: () => {} },
    mobile: { enabled: false, transactionHandler: () => {} },
  },
  /*
   * @TODO These need to be message descriptors
   */
  appMetadata: {
    name: 'Colony CDapp',
    icon: colonyIcon.content.replace('symbol', 'svg'),
    description: `A interation of the Colony Dapp sporting both a fully decentralized operating mode, as well as a mode enhanced by a metadata caching layer`,
  },
});

/**
 * Watch for changes in Metamask account, and log the user out when they happen.
 *
 * @TODO Refactor to remove the use of purser
 */
// function* metaMaskWatch(walletAddress: Address) {
// // const channel = eventChannel((emit) => {
// //   accountChangeHook((addresses): void => {
// //     const [selectedAddress] = addresses;
// //     if (selectedAddress) {
// //       return emit(createAddress(selectedAddress));
// //     }
// //     return undefined;
// //   });
// //   return () => null;
// });

export function* getWallet() {
  // yield openGanacheWallet(action);

  const lastWalletLabel = getLastWallet();
  const connectOptions = {
    autoSelect: {
      label: lastWalletLabel,
      disableModals: true,
    },
  };

  let wallet;
  if (lastWalletLabel) {
    [wallet] = yield onboard.connectWallet(connectOptions as ConnectOptions);
  } else {
    [wallet] = yield onboard.connectWallet();
  }

  if (!wallet) {
    return undefined;
  }

  setLastWallet(wallet.label);

  if (wallet.label.includes('Dev')) {
    wallet.label = DevelopmentWallets.Ganache;
  }
  const [account] = wallet.accounts;
  return {
    ...wallet,
    ...account,
  };
}
