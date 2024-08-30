import { createContext, useContext } from 'react';

import { type ColonyContributor } from '~types/graphql.ts';

export const MemberContext = createContext<
  | {
      membersByAddress: Record<string, ColonyContributor>;
      filteredMembers: ColonyContributor[];
      verifiedMembers: ColonyContributor[];
      totalMemberCount: number;
      totalMembers: ColonyContributor[];
      followersCount: number;
      followers: ColonyContributor[];
      pagedMembers: ColonyContributor[];
      moreMembers: boolean;
      loadMoreMembers: () => void;
      membersLimit: number;
      filteredContributors: ColonyContributor[];
      totalContributors: ColonyContributor[];
      totalContributorCount: number;
      pagedContributors: ColonyContributor[];
      moreContributors: boolean;
      loadMoreContributors: () => void;
      loading: boolean;
    }
  | undefined
>(undefined);

export const useMemberContext = () => {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error(
      'useMemberContext must be used within the MemberContextProvider',
    );
  }
  return context;
};
