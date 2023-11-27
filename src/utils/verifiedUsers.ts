import { Address, MemberUser } from '~types';

export const getVerifiedUsers = (
  verifiedAddresses: Address[],
  colonyMembers: MemberUser[],
) => {
  const verified = new Set(verifiedAddresses);
  return colonyMembers.filter((member) => verified.has(member.walletAddress));
};

export const isUserVerified = (
  userAddress: Address,
  whitelistedAddresses: Address[],
) => whitelistedAddresses.some((address) => address === userAddress);
