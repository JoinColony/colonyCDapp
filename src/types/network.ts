import { Network as ColonyJSNetwork } from '@colony/colony-js';

export enum Network {
  Mainnet = 'mainnet',
  Goerli = 'goerli',
  Gnosis = 'gnosis',
  GnosisFork = 'gnosisFork',
  Ganache = 'ganache',
}

export const ColonyJSNetworkMapping = {
  [Network.Mainnet]: ColonyJSNetwork.Mainnet,
  [Network.Goerli]: ColonyJSNetwork.Goerli,
  [Network.Gnosis]: ColonyJSNetwork.Xdai,
  [Network.GnosisFork]: ColonyJSNetwork.XdaiQa,
  [Network.Ganache]: ColonyJSNetwork.Custom,
};
