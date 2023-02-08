import { ApolloClient as ApolloClientClass } from '@apollo/client';

import { Wallet as WalletType } from '~types';

import ColonyManagerClass from './ColonyManager';

import apolloClient from './apollo';
import UserSettingsClass from './userSettings';

export { UserSettingsClass as UserSettings };

export { AppContext, AppContextProvider } from './AppContext';
export { ColonyManagerClass as ColonyManager };
export { ColonyContext, ColonyContextProvider } from './ColonyContext';

export enum ContextModule {
  Wallet = 'wallet',
  ColonyManager = 'colonyManager',
  ApolloClient = 'apolloClient',
  UserSettings = 'userSettings',
}

export interface IpfsWithFallbackSkeleton {
  getString: (hash: string) => Promise<any>;
  addString: (hash: string) => Promise<any>;
}

export interface Context {
  [ContextModule.Wallet]?: WalletType;
  [ContextModule.ColonyManager]?: ColonyManagerClass;
  [ContextModule.ApolloClient]?: ApolloClientClass<object>;
  [ContextModule.UserSettings]?: UserSettingsClass;
}

const context: Context = {
  [ContextModule.ApolloClient]: apolloClient,
  [ContextModule.ColonyManager]: undefined,
  [ContextModule.Wallet]: undefined,
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
