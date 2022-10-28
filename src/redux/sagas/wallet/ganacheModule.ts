/* eslint-disable camelcase */

import { createEIP1193Provider } from '@web3-onboard/common';
import { providers, Wallet, utils } from 'ethers';

import { RpcMethods } from '~types';

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
          [RpcMethods.BlockNumber]: async () => {
            const { number } = await ganacheProvider.getBlock('latest');
            return number;
          },
          [RpcMethods.EstimateGas]: async ({ params: [transaction] }) =>
            ganacheProvider.estimateGas(transaction),
          [RpcMethods.Accounts]: async () => {
            return [currentWalletAddress];
          },
          [RpcMethods.SelectAccounts]: async () => {
            return [currentWalletAddress];
          },
          [RpcMethods.RequestAccounts]: async () => {
            return [currentWalletAddress];
          },
          [RpcMethods.ChainId]: async () => {
            return (currentChain && currentChain.id) || '';
          },
          [RpcMethods.GetBalance]: async () => {
            const balance = await ganacheProvider.getBalance(
              currentWalletAddress,
              'latest',
            );
            return balance.toString();
          },
          [RpcMethods.SendTransaction]: async ({
            params: [{ gas, ...transaction }],
          }) => {
            const { hash } = await ganacheWallet.sendTransaction({
              gasLimit: gas,
              ...transaction,
            });
            return hash;
          },
          [RpcMethods.GetTransactionByHash]: async ({
            params: [transactionHash],
          }) => ganacheProvider.getTransaction(transactionHash),
          [RpcMethods.Sign]: async ({ params: [, message] }) =>
            ganacheWallet.signMessage(message),
          [RpcMethods.PersonalSign]: async ({ params: [message] }) =>
            ganacheWallet.signMessage(message),
          [RpcMethods.SignTypedData]: async ({ params: [, typedData] }) =>
            ganacheProvider.send(RpcMethods.SignTypedData, [
              currentWalletAddress,
              JSON.parse(typedData),
            ]),
          /*
           * @NOTE EIP1193Provider apparetly doesn't know about the v4 of this
           * RPC call, but both ethers v5 and Metamask use it, so in order to
           * properly sign typed data we actually have to support it
           */
          // @ts-ignore
          [RpcMethods.SignTypedDataV4]: async ({ params: [, typedData] }) =>
            ganacheProvider.send(RpcMethods.SignTypedData, [
              currentWalletAddress,
              JSON.parse(typedData),
            ]),
          [RpcMethods.GasPrice]: async () => {
            const gasPrice = await ganacheProvider.getGasPrice();
            return gasPrice.toHexString();
          },
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
