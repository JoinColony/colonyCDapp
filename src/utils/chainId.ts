import { BigNumber } from 'ethers';

/**
 * web3-onboard stores chainId as hex strings. E.g. ganache id of 2656691 is stored as "0x2889b3".
 * This utility converts the chain id to its hex equivalent.
 * @param chainId chain id
 * @returns Hex string.
 */
export const getChainIdAsHex = (chainId: string) =>
  `0x${BigNumber.from(chainId).toHexString()}`;

/**
 * web3-onboard stores chainId as hex strings. E.g. ganache id of 2656691 is stored as "0x2889b3".
 * This utility converts the hex string back to its original number form.
 * @param hex Hex string
 * @returns Chain id.
 */
export const getChainIdFromHex = (hex: string) =>
  BigNumber.from(hex).toString();
