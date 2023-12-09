import Onboard, { InitOptions } from '@web3-onboard/core';
import injectedWallets from '@web3-onboard/injected-wallets';

import axios from 'axios';
import colonyIcon from '~images/icons/colony-logo-wallet.svg';
import {
  TERMS_AND_CONDITIONS,
  CDAPP_VERSION,
  TOKEN_DATA,
  GANACHE_NETWORK,
  GANACHE_LOCAL_RPC_URL,
} from '~constants';
import { intl } from '~utils/intl';
import { getChainIdAsHex } from '~utils/autoLogin';
import { Network } from '~types';

import ganacheModule from './ganacheModule';

const { formatMessage } = intl({
  'metadata.name': 'Colony App',
  'metadata.description': `Logging into your Colony is done using your wallet. You’ll be able to perform actions, contribute, and make use of any earned reputation.`,
  'info.text': 'Connect your wallet to log in',
});

const ganacheAccountsUrl = new URL(
  process.env.GANACHE_ACCOUNTS_ENDPOINT || 'http://localhost:3006',
);

const getDevelopmentWallets = async () => {
  // variable injected by webpack
  // @ts-ignore
  // if we're using the webpack.dev config, include dev wallets
  if (!WEBPACK_IS_PRODUCTION) {
    const { private_keys: ganachePrivateKeys } = (
      await axios.get(`${ganacheAccountsUrl.href}/ganache-accounts.json`)
    ).data;

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

// chains: [
//   {
//     /*
//      * chain id for @web3-onboard needs to be expressed as a hex string
//      */
//     // id: `0x${GANACHE_NETWORK.chainId.toString(16)}`,
//     id: '0x64',
//     token: TOKEN_DATA[Network.Gnosis].symbol,
//     label: 'Metamask Wallet',
//     rpcUrl: 'https://rpc.gnosischain.com',
//   },
// ],

const onboardConfig: InitOptions = {
  wallets: [injectedWallets()],
  // Chains array only used in `ganacheModule` for use in development.
  chains: [
    {
      // web3-onboard formats chain id as hex strings
      id: getChainIdAsHex(GANACHE_NETWORK.chainId),
      token: TOKEN_DATA[Network.Ganache].symbol,
      label: GANACHE_NETWORK.shortName,
      rpcUrl: GANACHE_LOCAL_RPC_URL,
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
    icon: colonyIcon.content.replace('symbol', 'svg'),
    description: formatMessage({ id: 'metadata.description' }),
    agreement: { termsUrl: TERMS_AND_CONDITIONS, version: CDAPP_VERSION },
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
