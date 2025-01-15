import { BigNumber } from 'ethers';
import { call, put, select } from 'redux-saga/effects';

import { ETH_GAS_STATION, XDAI_GAS_STATION } from '~constants/externalUrls.ts';
import { DEFAULT_NETWORK } from '~constants/index.ts';
import { ContextModule, getContext } from '~context/index.ts';
import { updateGasPrices } from '~redux/actionCreators/index.ts';
import { type GasPricesProps } from '~redux/immutable/index.ts';
import { gasPrices as gasPricesSelector } from '~redux/selectors/index.ts';
import { Network } from '~types/network.ts';
import { RpcMethods } from '~types/rpcMethods.ts';
import debugLogging from '~utils/debug/debugLogging.ts';

interface EthGasStationAPIResponse {
  average: number;
  avgWait: number;

  block_time: number;
  blockNum: number;
  fast: number;
  fastest: number;
  fastWait: number;
  fastestWait: number;
  safeLow: number;
  safeLowWait: number;
  speed: number;
}

interface BlockscoutGasStationAPIResponse {
  average: number;
  fast: number;
  slow: number;
}

const DEFAULT_GAS_PRICE = BigNumber.from('3000000000');

const fetchGasPrices = async (): Promise<GasPricesProps> => {
  const defaultGasPrices = {
    timestamp: Date.now(),
    network: DEFAULT_GAS_PRICE,

    suggested: DEFAULT_GAS_PRICE,
    cheaper: DEFAULT_GAS_PRICE,
    faster: DEFAULT_GAS_PRICE,

    suggestedWait: 60,
    cheaperWait: 60,
    fasterWait: 60,
  };

  try {
    let userWallet;
    try {
      userWallet = getContext(ContextModule.Wallet);
    } catch (error) {
      // user wallet not set yet
    }

    if (!userWallet) {
      throw new Error(
        'User wallet is not connected, aborting gas price update',
      );
    }

    const rawNetworkGasPrice = await userWallet.provider.request({
      method: RpcMethods.GasPrice,
    });
    defaultGasPrices.network = BigNumber.from(rawNetworkGasPrice);

    let response;

    if (DEFAULT_NETWORK === Network.Mainnet) {
      response = await fetch(ETH_GAS_STATION);
    }
    if (
      DEFAULT_NETWORK === Network.Gnosis ||
      DEFAULT_NETWORK === Network.GnosisFork
    ) {
      response = await fetch(XDAI_GAS_STATION);
    }

    if (
      DEFAULT_NETWORK === Network.ArbitrumOne ||
      DEFAULT_NETWORK === Network.ArbitrumSepolia
    ) {
      response = { ok: true };
    }

    if (DEFAULT_NETWORK !== Network.Ganache && !response.ok) {
      throw new Error(response.statusText);
    }

    if (DEFAULT_NETWORK === Network.Mainnet) {
      const data: EthGasStationAPIResponse = await response.json();
      // API prices are in 10Gwei, so they need to be normalised
      const pointOneGwei = BigNumber.from(10 ** 8);

      return {
        ...defaultGasPrices,

        suggested: BigNumber.from(data.average).mul(pointOneGwei),
        cheaper: BigNumber.from(data.safeLow).mul(pointOneGwei),
        faster: BigNumber.from(data.fast).mul(pointOneGwei),

        suggestedWait: data.avgWait * 60,
        cheaperWait: data.safeLowWait * 60,
        fasterWait: data.fastWait * 60,
      };
    }

    if (
      DEFAULT_NETWORK === Network.Gnosis ||
      DEFAULT_NETWORK === Network.GnosisFork
    ) {
      const data: BlockscoutGasStationAPIResponse = await response.json();
      // API prices are in Gwei, so they need to be normalised
      const oneGwei = BigNumber.from(10 ** 9);

      /*
       * @NOTE IF we're on Gnosis Chain, ensure that transactions always pay at
       * least 3.5gwei for gas
       *
       * This to counteract some unpleasantness coming from the Blockscout gas oracle
       *
       * Locally this is not a problem (and we don't even use the oracle to estimate)
       */
      let { average } = data;
      let { fast } = data;
      average = data.average > 3.5 ? data.average : 3.5;
      fast = data.fast > 3.5 ? data.fast : 3.5;

      /*
       * @NOTE Split the values into integer and remainder
       * (1.22 becomes 1 and 22)
       *
       * The integer part gets multiplied by 1 gwei, while the remainder
       * gets padded with 9 zeros. Everything will be added together.
       */
      const [averageInteger, averageRemainder = 0] = String(average).split('.');
      const [slowInteger, slowRemainder = 0] = String(data.slow).split('.');
      const [fastInteger, fastRemainder = 0] = String(fast).split('.');

      return {
        ...defaultGasPrices,

        suggested: BigNumber.from(averageInteger)
          .mul(oneGwei)
          .add(String(averageRemainder).padEnd(9, '0')),
        cheaper: BigNumber.from(slowInteger)
          .mul(oneGwei)
          .add(String(slowRemainder).padEnd(9, '0')),
        faster: BigNumber.from(fastInteger)
          .mul(oneGwei)
          .add(String(fastRemainder).padEnd(9, '0')),
      };
    }

    // We don't have a oracle for Arbitrum, so we have to do our best
    if (
      DEFAULT_NETWORK === Network.ArbitrumOne ||
      DEFAULT_NETWORK === Network.ArbitrumSepolia
    ) {
      const cheaper = defaultGasPrices.network;
      const { maxFeePerGas, maxPriorityFeePerGas } =
        await userWallet.ethersProvider.getFeeData();

      debugLogging('GAS DEBUG', {
        maxFeePerGas,
        maxPriorityFeePerGas,
        userWallet,
      });

      return {
        ...defaultGasPrices,

        cheaper,
        suggested: cheaper.mul(150).div(100), // 50% more than network
        faster: cheaper.mul(200).div(100), // 100% more than network

        maxFeePerGas,
        maxPriorityFeePerGas,

        suggestedWait: -Infinity,
        cheaperWait: -Infinity,
        fasterWait: -Infinity,
      };
    }

    return defaultGasPrices;
  } catch (caughtError) {
    console.info(
      `Could not get ${DEFAULT_NETWORK} network gas prices: ${caughtError.message}`,
    );
    // Default values
    return {
      ...defaultGasPrices,
      timestamp: -Infinity, // Do not cache this
    };
  }
};

export default function* getGasPrices() {
  const cachedPrices = yield select(gasPricesSelector);

  if (Date.now() - cachedPrices.timestamp < 15 * 60 * 1000) {
    return cachedPrices;
  }

  const gasPrices: GasPricesProps = yield call(fetchGasPrices);

  yield put(updateGasPrices(gasPrices));

  return gasPrices;
}
