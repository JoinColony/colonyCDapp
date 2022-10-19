/* eslint-disable camelcase */

import { createEIP1193Provider } from '@web3-onboard/common';
import { providers, Wallet, utils } from 'ethers';

import walletIcon from '~images/icons/wallet.svg';

const ganacheWalletModule = (privateKey, optionalAccountIndex = 1) => {
  const initWallet = () => {
    return {
      label: `Dev Wallet ${optionalAccountIndex}`,
      getIcon: async () => walletIcon.content.replace('symbol', 'svg'),
      getInterface: async ({ EventEmitter, chains }) => {
        const [currentChain] = chains;
        /*
         * @TODO This needs to be set properly
         */
        const ganacheProvider = new providers.JsonRpcProvider(
          currentChain.rpcUrl,
        );
        const ganacheWallet = new Wallet(privateKey, ganacheProvider);
        const currentWalletAddress = utils.getAddress(ganacheWallet.address);
        const provider = createEIP1193Provider(ganacheProvider, {
          eth_accounts: async () => {
            return [currentWalletAddress];
          },
          eth_selectAccounts: async () => {
            return [currentWalletAddress];
          },
          eth_requestAccounts: async () => {
            return [currentWalletAddress];
          },
          eth_chainId: async () => {
            return (currentChain && currentChain.id) || '';
          },
          eth_getBalance: async () => {
            const balance = await ganacheProvider.getBalance(
              currentWalletAddress,
              'latest',
            );
            return balance.toString();
          },
          /*
           * @TODO Add the "main" transaction methods:
           * sign, signTransaction, sendTransaction, signTypedData, etc
           */
        });
        const eventEmitter = new EventEmitter();
        provider.on = eventEmitter.on.bind(eventEmitter);
        return { provider };
      },
    };
  };
  return initWallet;
};

export default ganacheWalletModule;
