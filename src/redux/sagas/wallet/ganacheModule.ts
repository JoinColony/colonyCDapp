import {
  createEIP1193Provider,
  type EIP1193Provider,
} from '@web3-onboard/common';
import { providers, Wallet, utils } from 'ethers';

import { RpcMethods } from '~types/rpcMethods.ts';

type CustomJsonRpcProvider = providers.JsonRpcProvider & {
  request: (args) => void;
};

export type CustomEIP1193Provider = EIP1193Provider & {
  getSigner: (addressOrIndex?: string | number) => providers.JsonRpcSigner;
};

const ganacheWalletModule = (privateKey: string, optionalAccountIndex = 1) => {
  const initWallet = () => {
    return {
      label: `Dev Wallet ${optionalAccountIndex}`,
      getIcon: async () =>
        `<svg version="1.1" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><path d="m27.483 8.2034h-24.441a3.4566 3.4409 0 0 1 0.77534-2.1611 3.5944 3.5781 0 0 1 2.8131-1.0131h20.766v-1.0293h-21.283v0.03855a4.3457 4.326 0 0 0-3.0757 1.3261 4.6932 4.672 0 0 0-1.0178 3.3707v16.751a0.51734 0.515 0 0 0 0.51662 0.51386h24.946a0.51799 0.51564 0 0 0 0.51662-0.51386v-16.768a0.51734 0.515 0 0 0-0.51662-0.51496zm-0.51662 16.769h-23.912v-15.74h23.912zm-5.7737-5.0762a2.585 2.5733 0 1 0-2.585-2.5732 2.5874 2.5756 0 0 0 2.585 2.5732zm0-4.1172a1.551 1.544 0 1 1-1.551 1.544 1.554 1.5469 0 0 1 1.551-1.544z" fill="var(--color-gray-900)" /></svg>`,
      getInterface: async ({ EventEmitter, chains }) => {
        const [currentChain] = chains;
        const ganacheProvider = new providers.JsonRpcProvider(
          currentChain.rpcUrl,
        );
        (ganacheProvider as CustomJsonRpcProvider).request = ({
          method,
          params,
        }) => ganacheProvider.send(method, params);
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
          [RpcMethods.PersonalSign]: async ({ params: [message] }) => {
            // Convert the signature to bytes before signing it
            const messageUint8 = utils.arrayify(message);
            return ganacheWallet.signMessage(messageUint8);
          },
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
        });
        const eventEmitter = new EventEmitter();
        provider.on = eventEmitter.on.bind(eventEmitter);
        return { provider } as { provider: CustomEIP1193Provider };
      },
    };
  };
  return initWallet;
};

export default ganacheWalletModule;
