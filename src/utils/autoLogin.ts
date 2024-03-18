// import { useState, useEffect } from 'react';
// import { open as purserOpenMetaMaskWallet } from '@purser/metamask';
// import { open as purserOpenSoftwareWallet } from '@purser/software';

import { NETWORK_AVAILABLE_CHAINS } from '~constants/index.ts';

// import { getAccounts } from '~users/ConnectWalletWizard/StepGanache';
// import { WalletMethod } from '~redux/immutable';
// import { Address } from '~types';
// import { createAddress } from '~utils/web3';
// import { ActionTypes } from '~redux';

// import { useAsyncFunction } from '~hooks';
// import { log } from './debug';

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

/**
 * web3-onboard stores chainId as hex strings. E.g. ganache id of 2656691 is stored as "0x2889b3".
 * This utility converts the chain id to its hex equivalent.
 * @param chainId chain id
 * @returns Hex string.
 */
export const getChainIdAsHex = (chainId: number) => `0x${chainId.toString(16)}`;

/**
 * web3-onboard stores chainId as hex strings. E.g. ganache id of 2656691 is stored as "0x2889b3".
 * This utility converts the hex string back to its original number form.
 * @param hex Hex string
 * @returns Chain id.
 */
export const getChainIdFromHex = (hex: string) =>
  parseInt(hex.substring(2), 16);

export const isChainSupported = (hexChainId: string) =>
  Object.values(NETWORK_AVAILABLE_CHAINS).some(
    (network) => network.chainId === getChainIdFromHex(hexChainId),
  );
