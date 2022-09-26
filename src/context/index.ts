import { ApolloClient as ApolloClientClass } from '@apollo/client';

import ColonyManagerClass from './ColonyManager';

import ENSClass from './ENS';

import ens from './ensContext';
import apolloClient from './apolloClient';
// import ipfsWithFallback from './ipfsWithFallbackContext';
import UserSettingsClass from './userSettings';

export { UserSettingsClass as UserSettings };

/*
 * @TOOD Refactor to remove the use of purser
 */
// interface ExtendedPurserWallet extends PurserWallet {
//   mmProvider?: {
//     _network?: {
//       chainId?: number;
//       name?: string;
//     };
//   };
//   signTypedData: (
//     typedData: Record<string, any>,
//   ) => Promise<{ signature: string; r: string; s: string; v?: number }>;
// }

export enum ContextModule {
  Wallet = 'wallet',
  ColonyManager = 'colonyManager',
  // IPFS = 'ipfs',
  ApolloClient = 'apolloClient',
  ENS = 'ens',
  // Pinata = 'pinataClient',
  // IPFSWithFallback = 'ipfsWithFallback',
  UserSettings = 'userSettings',
}

export interface IpfsWithFallbackSkeleton {
  getString: (hash: string) => Promise<any>;
  addString: (hash: string) => Promise<any>;
}

export interface Context {
  [ContextModule.Wallet]?: Record<string, any>;
  [ContextModule.ColonyManager]?: ColonyManagerClass;
  // @todo type the client cache properly
  [ContextModule.ApolloClient]?: ApolloClientClass<object>;
  [ContextModule.ENS]?: ENSClass;
  // [ContextModule.IPFSWithFallback]?: IpfsWithFallbackSkeleton;
  [ContextModule.UserSettings]?: UserSettingsClass;
}

const context: Context = {
  [ContextModule.ApolloClient]: apolloClient,
  [ContextModule.ColonyManager]: undefined,
  [ContextModule.ENS]: ens,
  [ContextModule.Wallet]: undefined,
  // [ContextModule.IPFSWithFallback]: ipfsWithFallback,
  [ContextModule.UserSettings]: undefined,
};

export const setContext = <K extends keyof Context>(
  contextKey: K,
  contextValue: Context[K],
) => {
  context[contextKey] = contextValue;
};

export const getContext = <K extends keyof Context>(
  contextKey: K,
): NonNullable<Context[K]> => {
  const ctx = context[contextKey];
  if (!ctx) throw new Error(`Could not get context: ${contextKey}`);
  // ctx is always defined from here on
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return ctx!;
};

export const removeContext = <K extends keyof Context>(contextKey: K) => {
  context[contextKey] = undefined;
};
