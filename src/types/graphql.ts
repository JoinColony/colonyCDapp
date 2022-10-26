import {
  Colony as BaseColony,
  Token as BaseToken,
  User as BaseUser,
  ColonyTokens as BaseColonyTokens,
  ModelColonyTokensConnection as BaseModelColonyTokensConnection,
  ModelWatchedColoniesConnection as BaseModelWatchedColoniesConnection,
  WatchedColonies as BaseWatchedColonies,
} from '~gql';

export type WatchedColonies = BaseWatchedColonies & {
  colonyAddress: string;
  user: User;
  colony: Colony;
};

export type ModelWatchedColoniesConnection =
  BaseModelWatchedColoniesConnection & {
    items: Array<WatchedColonies | null>;
  };

export type ColonyTokens = BaseColonyTokens & {
  token: Token;
};

export type ModelColonyTokensConnection = BaseModelColonyTokensConnection & {
  items: Array<ColonyTokens | null>;
};

export type User = BaseUser & {
  walletAddress: string;
  watchlist?: ModelWatchedColoniesConnection | null;
};

export type Token = BaseToken & {
  tokenAddress: string;
};

export type Colony = BaseColony & {
  colonyAddress: string;
  nativeToken: Token;
  tokens?: ModelColonyTokensConnection | null;
  watchers?: ModelWatchedColoniesConnection | null;
};
