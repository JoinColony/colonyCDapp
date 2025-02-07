import { type ColonyClaims } from '~types/graphql.ts';

export const getGroupedUnclaimedClaimsByChain = (
  unclaimedClaims: ColonyClaims[],
) => {
  const groupedUnclaimedClaims = unclaimedClaims.reduce(
    (acc, claim) => {
      if (!claim || !claim.token) return acc;

      const { chainId } = claim.token?.chainMetadata ?? {};
      const { tokenAddress } = claim.token;

      // Ensure the chainId group exists
      if (!acc[chainId]) {
        acc[chainId] = new Set();
      }

      acc[chainId].add(tokenAddress);

      return acc;
    },
    {} as Record<string, Set<string>>,
  );

  return Object.entries(groupedUnclaimedClaims).map(
    ([chainId, addressesSet]) => ({
      chainId,
      tokenAddresses: Array.from(addressesSet),
    }),
  );
};
