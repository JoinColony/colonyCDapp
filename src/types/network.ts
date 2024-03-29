import { Network as ColonyJSNetwork } from '@colony/colony-js';

export enum Network {
  Mainnet = 'mainnet',
  Goerli = 'goerli',
  Gnosis = 'gnosis',
  GnosisFork = 'gnosisFork',
  Ganache = 'ganache',
  Polygon = 'polygon',
  Amoy = 'amoy',
}

export const ColonyJSNetworkMapping = {
  [Network.Mainnet]: ColonyJSNetwork.Mainnet,
  [Network.Goerli]: ColonyJSNetwork.Goerli,
  [Network.Gnosis]: ColonyJSNetwork.Xdai,
  [Network.GnosisFork]: ColonyJSNetwork.XdaiQa,
  [Network.Ganache]: ColonyJSNetwork.Custom,
  [Network.Polygon]: ColonyJSNetwork.Polygon,
  [Network.Amoy]: ColonyJSNetwork.Amoy,
};
