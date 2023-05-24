// import { eventChannel } from 'redux-saga';

import {
  JsonRpcProvider,
  Web3Provider,
  Network,
} from '@ethersproject/providers';
import { providers } from 'ethers';
import { WalletState } from '@web3-onboard/core';

import { GANACHE_LOCAL_RPC_URL, isDev } from '~constants';

// import ganacheModule from './ganacheModule';

// import { private_keys as ganachePrivateKeys } from '../../../../amplify/mock-data/colonyNetworkArtifacts/ganache-accounts.json';

// import {
//   create as createSoftwareWallet,
//   open as purserOpenSoftwareWallet,
// } from '@purser/software';
// import { addChain } from '@purser/metamask/lib-esm/helpers';

import {
  setLastWallet,
  LastWallet,
  clearLastWallet,
  getChainIdAsHex,
} from '~utils/autoLogin';
// import { ActionTypes } from '../../actionTypes';
// import { Action, AllActions } from '../../types/actions';
import { BasicWallet } from '~types';
import { ContextModule, getContext } from '~context';
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

const getProvider = (walletLabel: string) => {
  let provider: JsonRpcProvider | Web3Provider | null = null;
  try {
    if (isDev && walletLabel.includes('Dev')) {
      provider = new providers.JsonRpcProvider(GANACHE_LOCAL_RPC_URL);
    } else if (window.ethereum) {
      provider = new providers.Web3Provider(window.ethereum);
    }
  } catch {
    // if provider cannot be instantiated, return null.
  }

  return provider;
};

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

export const getBasicWallet = async (lastWallet: LastWallet) => {
  const provider = getProvider(lastWallet.type);
  const network: Network | undefined = await provider?.getNetwork();
  if (network?.chainId) {
    return {
      address: lastWallet.address,
      label: lastWallet.type,
      chains: [{ id: getChainIdAsHex(network.chainId), namespace: 'evm' }],
    } as BasicWallet;
  }

  // Could not connect to provider
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

  return {
    ...wallet,
    ...account,
  };
};
