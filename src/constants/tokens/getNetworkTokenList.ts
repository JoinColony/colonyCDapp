import { Network } from '@colony/colony-js';

import { DEFAULT_NETWORK } from '~constants/index.ts';
import { createAddress } from '~utils/web3/index.ts';

import goerliTokenList from './tokenList.goerli.json';
import mainnetTokenList from './tokenList.mainnet.json';
import xdaiTokenList from './tokenList.xdai.json';

interface ListToken {
  avatar?: string;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainMetadata: {
    chainId: string;
  };
}

interface FormattedListToken {
  token: {
    avatar?: string;
    tokenAddress: string;
    symbol: string;
    name: string;
    decimals: number;
    chainMetadata: {
      chainId: string;
    };
  };
}

const checksumAddresses = (listToken: ListToken): FormattedListToken => ({
  token: {
    ...listToken,
    tokenAddress: createAddress(listToken.address),
  },
});

export const getNetworkTokenList = (): FormattedListToken[] => {
  switch (DEFAULT_NETWORK) {
    case Network.Mainnet:
      return mainnetTokenList.map(checksumAddresses);
    case Network.Goerli:
      return goerliTokenList.map(checksumAddresses);
    case Network.Xdai:
      return xdaiTokenList.map(checksumAddresses);
    default:
      return [];
  }
};
