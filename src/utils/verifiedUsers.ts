import { Address, ColonyContributor } from '~types';

export const getVerifiedUsers = (
  verifiedAddresses: Address[],
  colonyMembers: ColonyContributor[],
) => {
  const verified = new Set(verifiedAddresses);
  return colonyMembers.filter((member) =>
    verified.has(member.contributorAddress),
  );
};

export const isUserVerified = (
  userAddress: Address,
  whitelistedAddresses: Address[],
) => whitelistedAddresses.some((address) => address === userAddress);
