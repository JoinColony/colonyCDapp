// import { useState, useEffect } from 'react';
// import { open as purserOpenMetaMaskWallet } from '@purser/metamask';
// import { open as purserOpenSoftwareWallet } from '@purser/software';

// import { getAccounts } from '~users/ConnectWalletWizard/StepGanache';
// import { WalletMethod } from '~redux/immutable';
// import { Address } from '~types';
// import { createAddress } from '~utils/web3';
// import { ActionTypes } from '~redux';

// import { useAsyncFunction } from '~hooks';
// import { log } from './debug';

export const LAST_WALLET_KEY = 'colony-last-wallet-type';
// export const LAST_ADDRESS_KEY = 'colony-last-wallet-address';

export const getLastWallet = () => localStorage.getItem(LAST_WALLET_KEY);

export const setLastWallet = (label: string) => {
  /*
   * @NOTE "Ganache" is manual label we set to dev wallets, and it's not something
   * That occurs naturally.
   * If this would be acidentally set, web3-onboard would not be able to autologin
   * again since it woundn't be able to find the label
   */
  if (label !== 'Ganache') {
    localStorage.setItem(LAST_WALLET_KEY, label);
  }
};

export const clearLastWallet = () => localStorage.removeItem(LAST_WALLET_KEY);

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
