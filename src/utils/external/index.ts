import { LATEST_TAG } from '@colony/colony-js';
import { type BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib.esm/utils';

import {
  NETWORK_RELEASES,
  ETHERSCAN_CONVERSION_RATE,
} from '~constants/externalUrls.ts';
import { DEFAULT_NETWORK, DEFAULT_NETWORK_INFO } from '~constants/index.ts';
import { Network } from '~types/network.ts';

interface EthUsdResponse {
  status: string;
  message: string;
  result: {
    ethbtc: string;

    ethbtc_timestamp: string;
    ethusd: string;
    ethusd_timestamp: string;
  };
}

interface BlockExplorerLinkProps {
  network?: string;
  linkType?: 'address' | 'tx' | 'token';
  addressOrHash: string;
}

/*
  Request dollar conversion value from etherScan
*/
export const getEthToUsd = async (
  ethValue: BigNumber,
): Promise<number | void> => {
  const ETH_USD_KEY = 'ethUsd';
  const ETH_USD_TIMESTAMP_KEY = 'ethUsdTimestamp';

  const cachedEthUsd = localStorage.getItem(ETH_USD_KEY) || null;
  const cachedEthUsdTimestamp =
    localStorage.getItem(ETH_USD_TIMESTAMP_KEY) || null;
  const currentTimestamp = new Date().getTime();

  /**
   * Since the xDai token is "stable", it will always have parity to 1 USD
   */
  if (DEFAULT_NETWORK === Network.Gnosis) {
    return new Promise((resolve) => {
      localStorage.setItem(ETH_USD_KEY, '1');
      localStorage.setItem(ETH_USD_TIMESTAMP_KEY, currentTimestamp.toString());
      // eslint-disable-next-line no-promise-executor-return
      return resolve(
        parseFloat(formatUnits(ethValue, 'ether')) * parseFloat('1'),
      );
    });
  }

  if (cachedEthUsd && cachedEthUsdTimestamp) {
    /*
      Cache exchange rate for one day
    */
    const olderThanOneDay =
      currentTimestamp - parseInt(cachedEthUsdTimestamp, 10) > 86400000;
    if (!olderThanOneDay) {
      return Promise.resolve(
        parseFloat(formatUnits(ethValue, 'ether')) * parseFloat(cachedEthUsd),
      );
    }
  }

  return fetch(ETHERSCAN_CONVERSION_RATE)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then((response: EthUsdResponse) => {
      const {
        result: { ethusd: ethUsd },
        status,
      } = response;
      if (status !== '1') {
        throw Error(`Invalid response data for getEthToUsd().`);
      }

      localStorage.setItem(ETH_USD_KEY, ethUsd);
      localStorage.setItem(ETH_USD_TIMESTAMP_KEY, currentTimestamp.toString());
      return parseFloat(formatUnits(ethValue, 'ether')) * parseFloat(ethUsd);
    })
    .catch(console.warn);
};

export const getBlockExplorerLink = ({
  linkType = 'address',
  addressOrHash,
}: BlockExplorerLinkProps): string => {
  if (!addressOrHash) {
    return '';
  }
  if (DEFAULT_NETWORK === Network.Ganache) {
    return '#';
  }

  return `${DEFAULT_NETWORK_INFO.blockExplorerUrl}/${linkType}/${addressOrHash}`;
};

export const getNetworkReleaseLink = () => `${NETWORK_RELEASES}/${LATEST_TAG}`;
