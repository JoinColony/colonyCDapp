import { NETWORK_AVAILABLE_CHAINS } from '~constants/index.ts';

import { getChainIdFromHex } from './chainId.ts';

export interface LastWallet {
  type: string;
  address: string;
}

const LAST_WALLET_KEY = 'autologin';

export const clearLastWallet = () => localStorage.removeItem(LAST_WALLET_KEY);

export const getLastWallet = () => {
  const lastWallet = localStorage.getItem(LAST_WALLET_KEY);
  return lastWallet ? (JSON.parse(lastWallet) as LastWallet) : null;
};

export const setLastWallet = (lastWallet: LastWallet) =>
  localStorage.setItem(LAST_WALLET_KEY, JSON.stringify(lastWallet));

export const isChainSupported = (hexChainId: string) =>
  Object.values(NETWORK_AVAILABLE_CHAINS).some(
    (network) => network.chainId === getChainIdFromHex(hexChainId),
  );
