/* eslint-disable camelcase */

import { createEIP1193Provider } from '@web3-onboard/common';
import { providers, Wallet, utils } from 'ethers';

import { private_keys as ganachePrivateKeys } from '../../../../amplify/mock-data/colonyNetworkArtifacts/ganache-accounts.json';

const ganacheProvider = new providers.JsonRpcProvider('http://localhost:8545');

const ganacheWalletModule = (accountIndex = 0) => {
  const initWallet = () => {
    const privateKey = Object.values(ganachePrivateKeys)[accountIndex];
    const ganacheWallet = new Wallet(privateKey, ganacheProvider);
    return {
      label: `Dev Wallet ${accountIndex + 1}`,
      getIcon: async () =>
        `<svg viewBox="0 0 30 30" version="1.1"><path d="M 27.483401,8.2034275 H 3.0428277 a 3.4565524,3.4408904 0 0 1 0.775345,-2.161134 3.5944035,3.5781169 0 0 1 2.813118,-1.013065 H 27.396876 V 3.9999125 H 6.1143417 v 0.03855 a 4.345739,4.3260477 0 0 0 -3.075734,1.326085 4.6932201,4.6719546 0 0 0 -1.017792,3.370696 V 25.486223 a 0.51734442,0.51500024 0 0 0 0.516615,0.513864 H 27.483385 A 0.51798547,0.51563846 0 0 0 28,25.486224 V 8.7185385 a 0.51734442,0.51500024 0 0 0 -0.516615,-0.51496 z M 26.966785,24.972813 H 3.0548827 V 9.2327435 H 26.96678 Z m -5.773726,-5.076171 a 2.5849645,2.5732518 0 1 0 -2.584973,-2.573215 2.5873633,2.5756397 0 0 0 2.584973,2.573215 z m 0,-4.11719 a 1.5509787,1.543951 0 1 1 -1.550999,1.543975 1.5539774,1.5469361 0 0 1 1.550999,-1.543975 z" /></svg>`,
      getInterface: async ({ EventEmitter, chains }) => {
        const currentChain = chains[0];
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
