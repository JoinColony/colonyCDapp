import { Network } from '@colony/colony-js';

import { DEFAULT_NETWORK } from '~constants';
import { createAddress } from '~utils/web3';

import mainnetTokenList from './tokens/tokenList.mainnet.json';
import goerliTokenList from './tokens/tokenList.goerli.json';
import xdaiTokenList from './tokens/tokenList.xdai.json';

interface ListToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
}

interface FormattedListToken {
  token: {
    tokenAddress: string;
    symbol: string;
    name: string;
    decimals: number;
  };
}

const checksumAddresses = (listToken: ListToken): FormattedListToken => ({
  token: {
    ...listToken,
    tokenAddress: createAddress(listToken.address),
  },
});

const getTokenList = (): FormattedListToken[] => {
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

export default getTokenList;
