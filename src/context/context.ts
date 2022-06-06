import { PurserWallet } from '@purser/core';

export enum ContextModule {
  Wallet = 'wallet',
}

export interface Context {
  [ContextModule.Wallet]?: PurserWallet;
}

const TEMP_newContext: Context = {
  [ContextModule.Wallet]: undefined,
};

export const setContext = <K extends keyof Context>(
  contextKey: K,
  contextValue: Context[K],
) => {
  TEMP_newContext[contextKey] = contextValue;
};

export const getContext = <K extends keyof Context>(
  contextKey: K,
): NonNullable<Context[K]> => {
  const ctx = TEMP_newContext[contextKey];
  if (!ctx) throw new Error(`Could not get context: ${contextKey}`);
  // ctx is always defined from here on
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return ctx!;
};

export const removeContext = <K extends keyof Context>(contextKey: K) => {
  TEMP_newContext[contextKey] = undefined;
};
