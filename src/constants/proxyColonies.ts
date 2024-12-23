import AvalancheIcon from '~icons/AvalancheIcon.tsx';
import BaseIcon from '~icons/BaseIcon.tsx';
import BinanceIcon from '~icons/BinanceIcon.tsx';
import EthereumIcon from '~icons/EthereumIcon.tsx';
import OptimismIcon from '~icons/OptimismIcon.tsx';
import PolygonIcon from '~icons/PolygonIcon.tsx';
import { type SupportedChain } from '~types/proxyColonies.ts';

// @TODO this probably needs to be setup more dynamically, but let's hardcode it for now
const ETHEREUM_NETWORK = {
  name: 'Ethereum',
  chainId: 265669101,
  icon: EthereumIcon,
};
const POLYGON_NETWORK = {
  name: 'Polygon',
  chainId: 265669102,
  icon: PolygonIcon,
};

const BASE_NETWORK = {
  name: 'Base',
  chainId: 265669103,
  icon: BaseIcon,
  isDisabled: true,
};

const OPTIMISM_NETWORK = {
  name: 'Optimism',
  chainId: 265669104,
  icon: OptimismIcon,
  isDisabled: true,
};
const AVALANCHE_NETWORK = {
  name: 'Avalanche',
  chainId: 265669105,
  icon: AvalancheIcon,
  isDisabled: true,
};

const BINANCE_NETWORK = {
  name: 'Binance',
  chainId: 265669106,
  icon: BinanceIcon,
  isDisabled: true,
};

export const SUPPORTED_CHAINS: SupportedChain[] = [
  ETHEREUM_NETWORK,
  POLYGON_NETWORK,
  BASE_NETWORK,
  OPTIMISM_NETWORK,
  AVALANCHE_NETWORK,
  BINANCE_NETWORK,
];
