/* eslint-disable camelcase */

import { createEIP1193Provider } from '@web3-onboard/common';
import { providers, Wallet, utils } from 'ethers';

import { RpcMethods } from '~types';

import walletIcon from '~images/icons/wallet.svg';

type CustomJsonRpcProvider = providers.JsonRpcProvider & {
  request: (args) => void;
};

const ganacheWalletModule = (privateKey, optionalAccountIndex = 1) => {
  const initWallet = () => {
    return {
      label: `Dev Wallet ${optionalAccountIndex}`,
      getIcon: async () => walletIcon.content.replace('symbol', 'svg'),
      getInterface: async ({ EventEmitter, chains }) => {
        const [currentChain] = chains;
        const ganacheProvider = new providers.JsonRpcProvider(currentChain.rpcUrl);
        (ganacheProvider as CustomJsonRpcProvider).request = ({ method, params }) =>
          ganacheProvider.send(method, params);
        const ganacheWallet = new Wallet(privateKey, ganacheProvider);
        const currentWalletAddress = utils.getAddress(ganacheWallet.address);
        const provider = createEIP1193Provider(ganacheProvider, {
          [RpcMethods.Accounts]: async () => {
            return [currentWalletAddress];
          },
          [RpcMethods.SelectAccounts]: async () => {
            return [currentWalletAddress];
          },
          [RpcMethods.RequestAccounts]: async () => {
            return [currentWalletAddress];
          },
          [RpcMethods.GetBalance]: async ({
            /*
             * @NOTE For some reason, the EIP1193Provider eth_getBalance method
             * isn't properly typed
             */
            // @ts-ignore
            params: [address = currentWalletAddress, block = 'latest'],
          }) => {
            const balance = await ganacheProvider.getBalance(address, block);
            return balance.toString();
          },
          [RpcMethods.PersonalSign]: async ({ params: [message] }) => ganacheWallet.signMessage(message),
          [RpcMethods.SignTypedData]: async ({ params: [, typedData] }) =>
            ganacheProvider.send(RpcMethods.SignTypedData, [currentWalletAddress, JSON.parse(typedData)]),
          /*
           * @NOTE EIP1193Provider apparetly doesn't know about the v4 of this
           * RPC call, but both ethers v5 and Metamask use it, so in order to
           * properly sign typed data we actually have to support it
           */
          // @ts-ignore
          [RpcMethods.SignTypedDataV4]: async ({ params: [, typedData] }) =>
            ganacheProvider.send(RpcMethods.SignTypedData, [currentWalletAddress, JSON.parse(typedData)]),
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
