import { useNavigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useGetMembersCountQuery } from '~gql';
import useBaseUrl from '~hooks/useBaseUrl.ts';
import { CREATE_COLONY_ROUTE_BASE } from '~routes';
import { getLastWallet } from '~utils/autoLogin.ts';

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
        isWatching: { eq: true },
        or: joinedColonies.map((colony) => ({
          colonyAddress: { eq: colony.colonyAddress },
        })),
      },
    },
    onCompleted: (data) => {
      if (data.searchColonyContributors?.nextToken) {
        fetchMore({
          variables: {
            isWatching: { eq: true },
            or: joinedColonies.map((colony) => ({
              colonyAddress: { eq: colony.colonyAddress },
            })),
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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const inviteLink = useBaseUrl(
    `${CREATE_COLONY_ROUTE_BASE}/${invitationCode}`,
  );

  const onCreateColony = () => {
    navigate(`${CREATE_COLONY_ROUTE_BASE}/${invitationCode}`);
  };

  const membersCount =
    contributorsCount?.searchColonyContributors?.aggregateItems[0]?.result
      ?.__typename === 'SearchableAggregateBucketResult'
      ? contributorsCount.searchColonyContributors.aggregateItems[0]?.result
          ?.buckets
      : [];

  const availableColonies = joinedColonies.map(
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

  return {
    canInteract,
    connectWallet,
    wallet,
    isLoading: walletConnecting || userLoading,
    isCardsLoading: joinedColoniesLoading || contributorsCountLoading,
    onCreateColony,
    remainingInvitations,
    inviteLink,
    availableColonies,
    hasShareableInvitationCode,
    hasWalletConnected: !!getLastWallet(),
  };
};
