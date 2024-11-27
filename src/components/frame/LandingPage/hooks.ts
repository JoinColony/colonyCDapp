import { isEqual } from 'lodash';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useGetMembersCountQuery } from '~gql';
import useBaseUrl from '~hooks/useBaseUrl.ts';
import usePrevious from '~hooks/usePrevious.ts';
import { CREATE_COLONY_ROUTE_BASE } from '~routes';
import { getLastWallet } from '~utils/autoLogin.ts';

export type AvailableColonies = {
  address: string;
  avatar: string | undefined;
  displayName: string | undefined;
  name: string;
  membersCount: number | undefined;
}[];

export const useLandingPage = () => {
  const {
    canInteract,
    joinedColonies,
    joinedColoniesLoading,
    user,
    connectWallet,
    wallet,
    walletConnecting,
    userLoading,
  } = useAppContext();

  const navigate = useNavigate();

  const {
    data: contributorsCount,
    fetchMore,
    loading: contributorsCountLoading,
  } = useGetMembersCountQuery({
    variables: {
      filter: {
        or: joinedColonies.map((colony) => ({
          and: [
            { colonyAddress: { eq: colony.colonyAddress } },
            {
              or: [
                { hasPermissions: { eq: true } },
                { hasReputation: { eq: true } },
              ],
            },
          ],
        })),
      },
    },
    skip: !joinedColonies.length,
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data.searchColonyContributors?.nextToken) {
        fetchMore({
          variables: {
            filter: {
              or: joinedColonies.map((colony) => ({
                and: [
                  { colonyAddress: { eq: colony.colonyAddress } },
                  {
                    or: [
                      { hasPermissions: { eq: true } },
                      { hasReputation: { eq: true } },
                    ],
                  },
                ],
              })),
            },
            nextToken: data.searchColonyContributors.nextToken,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            return {
              ...prev,
              getActionsByColony: {
                ...prev.searchColonyContributors,
                items: [
                  ...(prev.searchColonyContributors?.aggregateItems[0]?.result
                    ?.__typename === 'SearchableAggregateBucketResult'
                    ? prev.searchColonyContributors?.aggregateItems[0]?.result
                        ?.buckets ?? []
                    : []),
                  ...(fetchMoreResult.searchColonyContributors
                    ?.aggregateItems[0]?.result?.__typename ===
                  'SearchableAggregateBucketResult'
                    ? fetchMoreResult.searchColonyContributors
                        ?.aggregateItems[0]?.result?.buckets ?? []
                    : []),
                ],
                nextToken: fetchMoreResult.searchColonyContributors?.nextToken,
              },
            };
          },
        });
      }
    },
  });

  const hasShareableInvitationCode =
    !!user?.privateBetaInviteCode?.shareableInvites;

  const remainingInvitations =
    user?.privateBetaInviteCode?.shareableInvites ?? 0;

  const invitationCode = user?.privateBetaInviteCode?.id;

  const baseInviteLink = `${CREATE_COLONY_ROUTE_BASE}/${invitationCode}`;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const inviteLink = useBaseUrl(baseInviteLink);

  const onCreateColony = () => {
    navigate(baseInviteLink);
  };

  const membersCount =
    contributorsCount?.searchColonyContributors?.aggregateItems[0]?.result
      ?.__typename === 'SearchableAggregateBucketResult'
      ? contributorsCount.searchColonyContributors.aggregateItems[0]?.result
          ?.buckets
      : [];

  const availableColonies: AvailableColonies = joinedColonies.map(
    ({ metadata, colonyAddress, name }) => ({
      address: colonyAddress,
      avatar: metadata?.avatar
        ? metadata?.thumbnail ?? metadata?.avatar
        : undefined,
      displayName: metadata?.displayName,
      name,
      membersCount: membersCount?.filter(
        (item) => item?.key === colonyAddress,
      )[0]?.doc_count,
    }),
  );

  const previousJoinedColonies = usePrevious(joinedColonies);

  const joinedColoniesFirstTimeLoading =
    !isEqual(previousJoinedColonies, joinedColonies) && joinedColoniesLoading;

  const isContentLoading =
    (userLoading ||
      joinedColoniesFirstTimeLoading ||
      contributorsCountLoading) &&
    !!wallet;

  return {
    canInteract:
      canInteract && (hasShareableInvitationCode || !!joinedColonies.length),
    connectWallet,
    wallet,
    isLoading: walletConnecting,
    isContentLoading,
    onCreateColony,
    remainingInvitations,
    inviteLink,
    availableColonies,
    hasShareableInvitationCode,
    hasWalletConnected: !!getLastWallet(),
  };
};
