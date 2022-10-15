import {
  Colony,
  Token,
  User,
  ColonyTokens,
  ModelColonyTokensConnection,
  ModelWatchedColoniesConnection,
  WatchedColonies,
} from './types';

export type FullWatchedColonies = WatchedColonies & {
  colonyAddress: string,
  user: FullUser,
};

export type FullModelWatchedColoniesConnection = ModelWatchedColoniesConnection & {
  items: Array<FullWatchedColonies | null>,
};

export type FullColonyTokens = ColonyTokens & {
  token: FullToken,
};

export type FullModelColonyTokensConnection = ModelColonyTokensConnection & {
  items: Array<FullColonyTokens | null>,
}

export type FullUser = User & {
  walletAddress: string,
  watchlist?: FullModelWatchedColoniesConnection | null,
};

export type FullToken = Token & {
  tokenAddress: string,
};

export type FullColony = Colony & {
  colonyAddress: string,
  nativeToken: FullToken,
  tokens?: FullModelColonyTokensConnection | null,
  watchers?: FullModelWatchedColoniesConnection | null,
};
