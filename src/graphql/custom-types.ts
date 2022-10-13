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
  user: FullUser,
};

export type FullModelWatchedColoniesConnection = ModelWatchedColoniesConnection & {
  items: Array<FullWatchedColonies | null>,
};

export type FullColonyTokens = ColonyTokens & {
  tokenAddress: string,
};

export type FullModelColonyTokensConnection = ModelColonyTokensConnection & {
  items: Array<FullColonyTokens | null>,
}

export type FullUser = User & {
  walletAddress: string,
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
