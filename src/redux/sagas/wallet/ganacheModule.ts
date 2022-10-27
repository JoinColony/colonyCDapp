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
          /*
           * @NOTE EIP1193Provider apparetly doesn't know about the eth_blockNumber
           * RPC call, but we need it in order for eth_sendTransaction to work
           * properly
           */
          // @ts-ignore
          eth_blockNumber: async () => {
            const { number } = await ganacheProvider.getBlock('latest');
            return number;
          },
          eth_estimateGas: async ({ params: [transaction] }) =>
            ganacheProvider.estimateGas(transaction),
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
          eth_sendTransaction: async ({
            params: [{ gas, ...transaction }],
          }) => {
            const { hash } = await ganacheWallet.sendTransaction({
              gasLimit: gas,
              ...transaction,
            });
            return hash;
          },
          eth_getTransactionByHash: async ({ params: [transactionHash] }) =>
            ganacheProvider.getTransaction(transactionHash),
          eth_sign: async ({ params: [, message] }) =>
            ganacheWallet.signMessage(message),
          personal_sign: async ({ params: [message] }) =>
            ganacheWallet.signMessage(message),
          eth_signTypedData: async ({ params: [, typedData] }) =>
            ganacheProvider.send('eth_signTypedData', [
              currentWalletAddress,
              JSON.parse(typedData),
            ]),
          /*
           * @NOTE EIP1193Provider apparetly doesn't know about the v4 of this
           * RPC call, but both ethers v5 and Metamask use it, so in order to
           * properly sign typed data we actually have to support it
           */
          // @ts-ignore
          eth_signTypedData_v4: async ({ params: [, typedData] }) =>
            ganacheProvider.send('eth_signTypedData', [
              currentWalletAddress,
              JSON.parse(typedData),
            ]),
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
