import Onboard, { InitOptions } from '@web3-onboard/core';
import injectedWallets from '@web3-onboard/injected-wallets';

import { private_keys as ganachePrivateKeys } from '../../../../amplify/mock-data/colonyNetworkArtifacts/ganache-accounts.json';

import colonyIcon from '~images/icons/colony-logo.svg';
import {
  isDev,
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
  'metadata.name': 'ColonyCDapp',
  'metadata.description': `An iteration of the Colony Dapp sporting both a fully decentralized operating mode, as well as a mode enhanced by a metadata caching layer`,
});

const getDevelopmentWallets = () => {
  if (isDev) {
    return (
      Object.values(ganachePrivateKeys)
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

const wallets = [injectedWallets(), ...getDevelopmentWallets()];

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
  wallets,
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
  connect: {
    showSidebar: false,
  },
  notify: {
    desktop: { enabled: false, transactionHandler: () => {} },
    mobile: { enabled: false, transactionHandler: () => {} },
  },
  appMetadata: {
    name: formatMessage({ id: 'metadata.name' }),
    icon: colonyIcon.content.replace('symbol', 'svg'),
    description: formatMessage({ id: 'metadata.description' }),
    agreement: { termsUrl: TERMS_AND_CONDITIONS, version: CDAPP_VERSION },
  },
};

const onboard = Onboard(onboardConfig);

export default onboard;
