import { ApolloClient as ApolloClientClass } from '@apollo/client';
import { OnboardAPI } from '@web3-onboard/core';

import { ColonyWallet } from '~types';

import ColonyManagerClass from './ColonyManager';

import apolloClient from './apolloClient';
import ipfsWithFallback from './ipfs/ipfsWithFallbackContext';
import { IPFSWithTimeout } from './ipfs/getIpfsWithFallback';

export { AppContext, AppContextProvider } from './AppContext';
export { ColonyManagerClass as ColonyManager };
export { ColonyContext, ColonyContextProvider } from './ColonyContext';
export {
  UserTokenBalanceContext,
  UserTokenBalanceProvider,
  useUserTokenBalanceContext,
} from './UserTokenBalanceContext';

export enum ContextModule {
  Wallet = 'wallet',
  ColonyManager = 'colonyManager',
  ApolloClient = 'apolloClient',
  Onboard = 'onboard',
  IPFSWithFallback = 'ipfsWithFallback',
}

export interface Context {
  [ContextModule.Wallet]?: ColonyWallet;
  [ContextModule.ColonyManager]?: ColonyManagerClass;
  [ContextModule.ApolloClient]?: ApolloClientClass<object>;
  [ContextModule.Onboard]?: OnboardAPI;
  [ContextModule.IPFSWithFallback]?: IPFSWithTimeout | null;
}

const context: Context = {
  [ContextModule.ApolloClient]: apolloClient,
  [ContextModule.ColonyManager]: undefined,
  [ContextModule.Wallet]: undefined,
  [ContextModule.Onboard]: undefined,
  [ContextModule.IPFSWithFallback]: ipfsWithFallback,
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
