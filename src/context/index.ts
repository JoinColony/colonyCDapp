import { ApolloClient as ApolloClientClass } from '@apollo/client';
import { OnboardAPI } from '@web3-onboard/core';

import { apolloClient } from '~apollo';
import { ColonyWallet } from '~types/wallet';

import ColonyManagerClass from './ColonyManager';
import { IPFSWithTimeout } from './ipfs/getIpfsWithFallback';
import ipfsWithFallback from './ipfs/ipfsWithFallbackContext';

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

export { ColonyManagerClass as ColonyManager };
