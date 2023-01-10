import { ApolloClient as ApolloClientClass } from '@apollo/client';

import { ColonyWallet } from '~types';

import ColonyManagerClass from './ColonyManager';

import apolloClient from './apolloClient';
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

export interface Context {
  [ContextModule.Wallet]?: ColonyWallet;
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

export const getContext = <K extends keyof Context>(contextKey: K) => {
  const ctx = context[contextKey];
  if (!ctx) throw new Error(`Could not get context: ${contextKey}`);

  return ctx;
};

export const removeContext = <K extends keyof Context>(contextKey: K) => {
  context[contextKey] = undefined;
};
