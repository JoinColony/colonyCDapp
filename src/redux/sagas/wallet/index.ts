// import { eventChannel } from 'redux-saga';
import { type WalletState } from '@web3-onboard/core';

// import ganacheModule from './ganacheModule';

// import { private_keys as ganachePrivateKeys } from '../../../../amplify/mock-data/colonyNetworkArtifacts/ganache-accounts.json';

// import {
//   create as createSoftwareWallet,
//   open as purserOpenSoftwareWallet,
// } from '@purser/software';
// import { addChain } from '@purser/metamask/lib-esm/helpers';

// import { ActionTypes } from '../../actionTypes';
// import { Action, AllActions } from '../../types/actions';

import { ContextModule, getContext } from '~context/index.ts';
import { type FullWallet } from '~types/wallet.ts';
import {
  setLastWallet,
  type LastWallet,
  clearLastWallet,
} from '~utils/autoLogin.ts';

import retryProviderFactory from './RetryProvider.ts';

// import { createAddress } from '~utils/web3';
// import { DEFAULT_NETWORK, NETWORK_DATA, TOKEN_DATA } from '~constants';

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

const getConnectOptions = (lastWallet: LastWallet | null) => {
  if (lastWallet) {
    return {
      autoSelect: {
        label: lastWallet.type,
        disableModals: true,
      },
    };
  }
  return undefined;
};

export const connectWallet = async (
  lastWallet: LastWallet | null,
): Promise<WalletState | undefined> => {
  const connectOptions = getConnectOptions(lastWallet);
  const onboard = getContext(ContextModule.Onboard);
  let [wallet] = await onboard.connectWallet(connectOptions);

  if (!wallet && lastWallet) {
    // means lastWallet is not recognised and autologin failed. Try connecting via modal.
    clearLastWallet();
    [wallet] = await onboard.connectWallet();
  }

  return wallet;
};

export const getWallet = async (lastWallet: LastWallet | null) => {
  const wallet = await connectWallet(lastWallet);

  if (!wallet) {
    return undefined;
  }

  const [account] = wallet.accounts;
  setLastWallet({ type: wallet.label, address: account.address });

  const RetryProvider = retryProviderFactory(wallet.label, account.address);
  const provider = new RetryProvider();

  return {
    ...wallet,
    ...account,
    ethersProvider: provider,
  } as FullWallet;
};
