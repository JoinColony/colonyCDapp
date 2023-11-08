import { ApolloClient as ApolloClientClass } from '@apollo/client';
import { OnboardAPI } from '@web3-onboard/core';

import { ColonyWallet } from '~types';

import ColonyManagerClass from './ColonyManager';

import apolloClient from './apolloClient';
import ipfsWithFallback from './ipfs/ipfsWithFallbackContext';
import { IPFSWithTimeout } from './ipfs/getIpfsWithFallback';

export enum ContextModule {
  Wallet = 'wallet',
  ColonyManager = 'colonyManager',
  ApolloClient = 'apolloClient',
  Onboard = 'onboard',
  IPFSWithFallback = 'ipfsWithFallback',
  CurrentColonyAddress = 'currentColonyAddress',
}

export interface Context {
  [ContextModule.Wallet]?: ColonyWallet;
  [ContextModule.ColonyManager]?: ColonyManagerClass;
  [ContextModule.ApolloClient]?: ApolloClientClass<object>;
  [ContextModule.Onboard]?: OnboardAPI;
  [ContextModule.IPFSWithFallback]?: IPFSWithTimeout | null;
  [ContextModule.CurrentColonyAddress]?: string;
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

export * from './ActionSidebarContext';
export * from './AppContext';
export { ColonyManagerClass as ColonyManager };
export * from './ColonyContext';
export * from './ColonyHomeContext';
export * from './PageHeadingContext';
export * from './PageThemeContext';
export * from './MemberModalContext';
export * from './UserTokenBalanceContext';
export * from './UserTransactionContext';
