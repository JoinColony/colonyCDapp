import Onboard, { type InitOptions } from '@web3-onboard/core';
import injectedWalletsModule from '@web3-onboard/injected-wallets';

import {
  TERMS_AND_CONDITIONS,
  CDAPP_VERSION,
  TOKEN_DATA,
  GANACHE_NETWORK,
  GANACHE_LOCAL_RPC_URL,
  ARBITRUM_NETWORK,
  ARBITRUM_SEPOLIA_NETWORK,
  GNOSIS_NETWORK,
} from '~constants/index.ts';
import { Network } from '~types/network.ts';
import { getChainIdAsHex } from '~utils/chainId.ts';
import { intl } from '~utils/intl.ts';

import ganacheModule from './ganacheModule.ts';

const { formatMessage } = intl({
  'metadata.name': 'Colony App',
  'metadata.description': `Logging into your Colony is done using your wallet. You'll be able to perform actions, contribute, and make use of any earned reputation.`,
  'info.text': 'Connect your wallet to log in',
});

const ganacheAccountsUrl = new URL(
  import.meta.env.VITE_NETWORK_FILES_ENDPOINT || 'http://localhost:3006',
);

const getDevelopmentWallets = async () => {
  // if we're using the dev config, include dev wallets
  if (import.meta.env.DEV) {
    const fetchRes = await fetch(
      `${ganacheAccountsUrl.href}ganache-accounts.json`,
    );
    const { private_keys: ganachePrivateKeys } = await fetchRes.json();

    return (
      Object.values(ganachePrivateKeys)
        // @ts-ignore
        .map((privateKey, index) => ganacheModule(privateKey, index + 1))
        /*
         * Remove the wallets used by the reputation miner and the block ingestor
         * As to not cause any "unplesantness"
         */
        .slice(0, -2)
    );
  }

  return [];
};

const onboardConfig: InitOptions = {
  wallets: [injectedWalletsModule()],
  // Chains array only used in `ganacheModule` for use in development.
  chains: [
    // local
    {
      // web3-onboard formats chain id as hex strings
      id: getChainIdAsHex(GANACHE_NETWORK.chainId),
      token: TOKEN_DATA[Network.Ganache].symbol,
      label: GANACHE_NETWORK.shortName,
      rpcUrl: GANACHE_LOCAL_RPC_URL,
    },
    // arbitrum
    {
      // web3-onboard formats chain id as hex strings
      id: getChainIdAsHex(ARBITRUM_NETWORK.chainId),
      token: TOKEN_DATA[Network.ArbitrumOne].symbol,
      label: ARBITRUM_NETWORK.shortName,
    },
    // arbitrum sepolia (testnet)
    {
      // web3-onboard formats chain id as hex strings
      id: getChainIdAsHex(ARBITRUM_SEPOLIA_NETWORK.chainId),
      token: TOKEN_DATA[Network.ArbitrumSepolia].symbol,
      label: ARBITRUM_SEPOLIA_NETWORK.shortName,
    },
    // gnosis
    {
      // web3-onboard formats chain id as hex strings
      id: getChainIdAsHex(GNOSIS_NETWORK.chainId),
      token: TOKEN_DATA[Network.Gnosis].symbol,
      label: GNOSIS_NETWORK.shortName,
    },
  ],
  accountCenter: {
    desktop: { enabled: false },
    mobile: { enabled: false },
  },
  notify: {
    desktop: { enabled: false, transactionHandler: () => {} },
    mobile: { enabled: false, transactionHandler: () => {} },
  },
  appMetadata: {
    name: formatMessage({ id: 'info.text' }),
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="currentColor" viewBox="0 0 256 256"><path fill="#101828" d="M128,64.7c17.7,0,32.1-14.5,32.1-32.3S145.7,0,128,0c-17.7,0-32.1,14.5-32.1,32.3   S110.3,64.7,128,64.7z"></path><path fill="#101828" d="M128,256c17.7,0,32.1-14.5,32.1-32.3c0-17.9-14.4-32.3-32.1-32.3c-17.7,0-32.1,14.5-32.1,32.3   C95.9,241.5,110.3,256,128,256z"></path><path fill="#101828" d="M222.7,160.3c17.7,0,32.1-14.5,32.1-32.3c0-17.9-14.4-32.3-32.1-32.3   c-17.7,0-32.1,14.5-32.1,32.3C190.6,145.9,204.9,160.3,222.7,160.3z"></path><path fill="#101828" d="M33,160.3c17.7,0,32.1-14.5,32.1-32.3S50.8,95.7,33,95.7S0.9,110.1,0.9,128S15.3,160.3,33,160.3   z"></path><path fill="#101828" d="M128.1,76L76.5,128l51.6,51.9l51.6-51.9L128.1,76z"></path><path fill="#101828" d="M185.9,69.7V14.1l55.2,55.6H185.9z"></path><path fill="#101828" d="M69.8,69.7H14.6l55.2-55.6V69.7z"></path><path fill="#101828" d="M69.8,186.3v55.6l-55.2-55.6H69.8z"></path><path fill="#101828" d="M185.9,186.3h55.2l-55.2,55.6V186.3z"></path></svg>`,
    logo: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 228 38" style="enable-background:new 0 0 228 38;" xml:space="preserve"><path d="M12.8,6.7c1.8,0,3.2-1.5,3.2-3.2s-1.4-3.2-3.2-3.2c-1.8,0-3.2,1.5-3.2,3.2c0,0,0,0,0,0C9.6,5.2,11,6.7,12.8,6.7 z M12.8,25.8c1.8,0,3.2-1.5,3.2-3.2c0-1.8-1.4-3.2-3.2-3.2c-1.8,0-3.2,1.5-3.2,3.2c0,0,0,0,0,0C9.6,24.4,11,25.8,12.8,25.8z M22.3,16.2c1.8,0,3.2-1.4,3.2-3.2s-1.4-3.2-3.2-3.2c-1.8,0-3.2,1.5-3.2,3.2c0,0,0,0,0,0C19.1,14.8,20.5,16.2,22.3,16.2z M3.2,16.2 c1.8,0,3.2-1.4,3.2-3.2S5,9.8,3.2,9.8C1.4,9.8,0,11.2,0,13c0,0,0,0,0,0C0,14.8,1.4,16.2,3.2,16.2z M12.8,7.8L7.6,13l5.2,5.2L18,13 C18,13,12.8,7.8,12.8,7.8z M18.6,7.2V1.6l5.5,5.6L18.6,7.2L18.6,7.2z M6.9,7.2H1.4l5.6-5.6V7.2L6.9,7.2z M6.9,18.8v5.6l-5.6-5.6 L6.9,18.8L6.9,18.8z M18.6,18.8h5.5l-5.5,5.6V18.8L18.6,18.8z M46.1,17.2c-0.3,0.3-0.6,0.5-0.9,0.7c-0.7,0.5-1.4,0.8-2.3,1 c-0.4,0.1-0.9,0.2-1.3,0.1c-1.1,0-2.2-0.3-3.2-0.8c-1-0.5-1.8-1.3-2.4-2.2c-0.3-0.5-0.5-0.9-0.6-1.4c-0.3-1.1-0.3-2.2,0-3.3 c0.1-0.5,0.4-1,0.6-1.4c0.3-0.5,0.6-0.9,1-1.2c0.4-0.4,0.8-0.7,1.3-0.9c0.5-0.3,1-0.5,1.5-0.6C40.5,7,41,6.9,41.6,6.9 c0.4,0,0.9,0,1.3,0.1c0.4,0.1,0.8,0.2,1.2,0.4c0.4,0.2,0.7,0.4,1,0.6c0.3,0.2,0.6,0.5,0.9,0.8l-1.6,1.8c-0.3-0.4-0.8-0.8-1.2-1 c-0.5-0.2-1-0.3-1.5-0.3c-1,0-1.9,0.4-2.6,1.1c-0.3,0.3-0.6,0.8-0.8,1.2c-0.4,1-0.4,2,0,3c0.2,0.4,0.5,0.9,0.8,1.2 c0.9,0.9,2.2,1.3,3.4,1c0.3-0.1,0.5-0.1,0.7-0.3c0.2-0.1,0.5-0.2,0.7-0.4c0.2-0.2,0.4-0.3,0.6-0.5L46.1,17.2L46.1,17.2z M51.3,13 c0-0.5,0.1-1.1,0.2-1.6c0.1-0.5,0.4-1,0.6-1.4c0.3-0.5,0.6-0.9,1-1.2C53.6,8.3,54,8,54.5,7.7c0.5-0.3,1-0.5,1.5-0.6 c1.1-0.3,2.3-0.3,3.4,0c1.1,0.3,2,0.8,2.8,1.6c0.8,0.7,1.3,1.7,1.6,2.7c0.3,1.1,0.3,2.2,0,3.3c-0.1,0.5-0.4,1-0.6,1.5 c-0.3,0.5-0.6,0.9-1,1.2c-0.4,0.4-0.8,0.7-1.3,0.9c-0.5,0.3-1,0.5-1.5,0.6c-1.7,0.4-3.4,0.2-4.9-0.6c-0.9-0.5-1.7-1.3-2.3-2.2 c-0.3-0.5-0.5-0.9-0.6-1.5C51.4,14.1,51.3,13.5,51.3,13L51.3,13z M54,13c0,0.5,0.1,1,0.3,1.5c0.2,0.4,0.5,0.9,0.8,1.2 c0.7,0.7,1.6,1.1,2.6,1.1c0.5,0,1-0.1,1.4-0.3c0.4-0.2,0.8-0.5,1.2-0.8c0.3-0.3,0.6-0.8,0.8-1.2c0.4-1,0.4-2,0-3 c-0.2-0.4-0.4-0.8-0.8-1.2c-0.7-0.7-1.6-1.1-2.6-1.1c-1,0-1.9,0.4-2.6,1.1c-0.3,0.3-0.6,0.8-0.8,1.2C54.2,12,54,12.5,54,13L54,13z M70.3,7.2H73v9.4h4.9v2.3h-7.6L70.3,7.2L70.3,7.2z M82.9,13c0-0.5,0.1-1.1,0.2-1.6c0.1-0.5,0.4-1,0.6-1.4c0.3-0.5,0.6-0.9,1-1.2 c0.8-0.7,1.7-1.3,2.8-1.6c1.1-0.3,2.3-0.3,3.4,0c0.5,0.1,1,0.3,1.5,0.6c0.5,0.3,0.9,0.6,1.3,0.9c0.4,0.4,0.7,0.8,1,1.2 c0.3,0.5,0.5,0.9,0.6,1.4c0.3,1.1,0.3,2.2,0,3.3c-0.1,0.5-0.4,1-0.6,1.5c-0.6,0.9-1.3,1.7-2.3,2.2c-1.5,0.8-3.3,1-4.9,0.6 c-0.5-0.1-1.1-0.3-1.5-0.6c-0.9-0.5-1.7-1.3-2.3-2.2c-0.3-0.5-0.5-0.9-0.6-1.4C82.9,14.1,82.8,13.5,82.9,13L82.9,13z M85.6,13 c0,0.5,0.1,1,0.3,1.5c0.2,0.5,0.5,0.9,0.8,1.2c1.1,1.1,2.7,1.4,4,0.8c0.4-0.2,0.8-0.4,1.1-0.8c0.3-0.3,0.6-0.8,0.8-1.2 c0.4-1,0.4-2,0-3c-0.4-0.9-1.1-1.6-2-2c-0.9-0.4-1.9-0.4-2.9,0c-0.4,0.2-0.8,0.4-1.2,0.8c-0.3,0.3-0.6,0.8-0.8,1.2 C85.7,12,85.6,12.5,85.6,13L85.6,13z M112.4,18.8H110l-5.6-7v7h-2.7V7.2h2.4l5.6,7v-7h2.7C112.4,7.2,112.4,18.8,112.4,18.8z M129.6,7.2l-4.5,7.3v4.4h-2.7v-4.4l-4.5-7.3h3.2l2.7,4.8h0l2.7-4.8L129.6,7.2L129.6,7.2z"/><path d="M129.6,7.2l-4.5,7.3v4.4h-2.7v-4.4l-4.5-7.3h3.2l2.7,4.8h0l2.7-4.8L129.6,7.2L129.6,7.2z"/></svg>`,
    description: formatMessage({ id: 'metadata.description' }),
    agreement: { termsUrl: TERMS_AND_CONDITIONS, version: CDAPP_VERSION },
  },
  connect: {
    removeWhereIsMyWalletWarning: true,
    removeIDontHaveAWalletInfoLink: true,
  },
  i18n: {
    en: {
      connect: {
        // @ts-ignore
        selectingWallet: {
          header: formatMessage({ id: 'metadata.name' }),
          sidebar: {
            heading: '',
            subheading: '',
            paragraph: formatMessage({ id: 'metadata.description' }),
          },
        },
      },
    },
  },
};

const getOnboard = async () => {
  const devWallets = await getDevelopmentWallets();
  onboardConfig.wallets.push(...devWallets);
  return Onboard(onboardConfig);
};
export default getOnboard;
