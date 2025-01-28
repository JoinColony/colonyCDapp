import { Network as ColonyJSNetwork } from '@colony/colony-js';

export enum Network {
  Mainnet = 'mainnet',
  Goerli = 'goerli',
  Gnosis = 'gnosis',
  GnosisFork = 'gnosisFork',
  Ganache = 'ganache',
  Polygon = 'polygon',
  Amoy = 'amoy',
  ArbitrumOne = 'arbitrumOne',
  ArbitrumSepolia = 'arbitrumSepolia',
  DevProxyChain1 = 'devProxyChain1',
  DevProxyChain2 = 'devProxyChain2',
}

export const ColonyJSNetworkMapping = {
  [Network.Mainnet]: ColonyJSNetwork.Mainnet,
  [Network.Goerli]: ColonyJSNetwork.Goerli,
  [Network.Gnosis]: ColonyJSNetwork.Xdai,
  [Network.GnosisFork]: ColonyJSNetwork.XdaiQa,
  [Network.Ganache]: ColonyJSNetwork.Custom,
  [Network.ArbitrumOne]: ColonyJSNetwork.ArbitrumOne,
  [Network.ArbitrumSepolia]: ColonyJSNetwork.ArbitrumSepolia,
};
