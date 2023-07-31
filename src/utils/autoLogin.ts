// import { useState, useEffect } from 'react';
// import { open as purserOpenMetaMaskWallet } from '@purser/metamask';
// import { open as purserOpenSoftwareWallet } from '@purser/software';

import { NETWORK_AVAILABLE_CHAINS } from '~constants';

// import { getAccounts } from '~users/ConnectWalletWizard/StepGanache';
// import { WalletMethod } from '~redux/immutable';
// import { Address } from '~types';
// import { createAddress } from '~utils/web3';
// import { ActionTypes } from '~redux';

// import { useAsyncFunction } from '~hooks';
// import { log } from './debug';

export interface LastWallet {
  type: string;
  address: string;
}

const LAST_WALLET_KEY = 'autologin';

export const clearLastWallet = () => localStorage.removeItem(LAST_WALLET_KEY);

export const getLastWallet = () => {
  const lastWallet = localStorage.getItem(LAST_WALLET_KEY);
  return lastWallet ? (JSON.parse(lastWallet) as LastWallet) : null;
};

export const setLastWallet = (lastWallet: LastWallet) =>
  localStorage.setItem(LAST_WALLET_KEY, JSON.stringify(lastWallet));

/**
 * web3-onboard stores chainId as hex strings. E.g. ganache id of 2656691 is stored as "0x2889b3".
 * This utility converts the chain id to its hex equivalent.
 * @param chainId chain id
 * @returns Hex string.
 */
export const getChainIdAsHex = (chainId: number) => `0x${chainId.toString(16)}`;

/**
 * web3-onboard stores chainId as hex strings. E.g. ganache id of 2656691 is stored as "0x2889b3".
 * This utility converts the hex string back to its original number form.
 * @param hex Hex string
 * @returns Chain id.
 */
export const getChainIdFromHex = (hex: string) =>
  parseInt(hex.substring(2), 16);

export const isChainSupported = (hexChainId: string) =>
  Object.values(NETWORK_AVAILABLE_CHAINS).some(
    (network) => network.chainId === getChainIdFromHex(hexChainId),
  );

// export const useWalletAutoLogin = (
//   lastWalletType: string,
//   lastWalletAddress: string,
// ) => {
//   const login = useAsyncFunction({
//     submit: ActionTypes.WALLET_OPEN,
//     success: ActionTypes.USER_CONTEXT_SETUP_SUCCESS,
//     error: ActionTypes.WALLET_OPEN_ERROR,
//   });

//   const [loading, setLoading] = useState(
//     lastWalletType === WalletMethod.MetaMask ||
//       lastWalletType === WalletMethod.Ganache,
//   );

//   useEffect(() => {
//     (async () => {
//       if (lastWalletType === WalletMethod.MetaMask) {
//         try {
//           /*
//            * @TODO Refactor to remove the use of purser
//            */
//           // const wallet = await purserOpenMetaMaskWallet();
//           const wallet = { address: '' };

//           if (
//             createAddress(wallet.address) === createAddress(lastWalletAddress)
//           ) {
//             await login({ method: WalletMethod.MetaMask });
//             return;
//           }
//         } catch (error) {
//           log.error(error);
//           log.debug('MetaMask auto login was attempted and failed');
//         }
//         clearLastWallet();
//         setLoading(false);
//       }
//       /*
//        * process.env.DEV is set by the QA server in case we want to have a debug build.
//        * We also don't want to load the accounts then
//        */
//       if (
//         lastWalletType === WalletMethod.Ganache &&
//         process.env.NODE_ENV === 'development' &&
//         !process.env.DEV
//       ) {
//         const ganacheAccounts = getAccounts();
//         try {
//           const lastGanacheAccount = ganacheAccounts.find(
//             ({ label }) => label === lastWalletAddress.toLowerCase(),
//           );

//           /*
//            * @TODO Refactor to remove the use of purser
//            */
//           // const wallet = await purserOpenSoftwareWallet({
//           //   privateKey: lastGanacheAccount?.value,
//           // });

//           const wallet = { getPrivateKey: () => lastGanacheAccount };
//           const privateKey = wallet ? await wallet.getPrivateKey() : '';
//           await login({
//             method: WalletMethod.Ganache,
//             privateKey,
//           });
//           return;
//         } catch (error) {
//           log.error(error);
//           log.debug('Ganache Account auto login was attempted and failed');
//         }
//         clearLastWallet();
//         setLoading(false);
//       }
//     })();
//   }, [lastWalletType, lastWalletAddress, login]);

//   return loading;
// };

/**
 * Will attempt to automatically log the user in based on last used wallet type
 * and address saved in localstorage. Currently supports only MetaMask.
 */
// export const useAutoLogin = () => {
//   const { type, address } = getLastWallet();
//   const loadingWallet = useWalletAutoLogin(type || '', address || '');
//   return loadingWallet;
// };
