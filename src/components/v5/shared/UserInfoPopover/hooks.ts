import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { useGetColonyContributorQuery } from '~gql';
import useContributorBreakdown from '~hooks/members/useContributorBreakdown.ts';
import { type User } from '~types/graphql.ts';
import { getColonyContributorId } from '~utils/members.ts';

export const useGetUserData = (walletAddress: string, user?: User | null) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();

  const { totalMembers, loading: isColonyMembersDataLoading } =
    useMemberContext();

  const contributorData = totalMembers.find(
    (member) => member?.contributorAddress === walletAddress,
  );

  const {
    data: colonyContributorData,
    loading: isColonyContributorDataLoading,
  } = useGetColonyContributorQuery({
    variables: {
      id: getColonyContributorId(colonyAddress, walletAddress),
      colonyAddress,
    },
    fetchPolicy: 'cache-first',
    skip: !!contributorData,
  });

  const contributor =
    contributorData || colonyContributorData?.getColonyContributor;
  const { bio } = contributor?.user?.profile || {};
  const { isVerified, type: contributorType } = contributor || {};
  const domains = useContributorBreakdown(contributor);
  const resolvedUser = contributor?.user ?? user;
  const { profile } = resolvedUser || {};
  const { avatar, displayName: userName } = profile || {};

  const isDataLoading =
    isColonyMembersDataLoading || isColonyContributorDataLoading;

  return {
    bio,
    domains,
    userName,
    avatar,
    isVerified,
    contributorType,
    isDataLoading,
    resolvedUser,
  };
};
