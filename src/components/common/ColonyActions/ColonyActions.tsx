import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { BigNumber } from 'ethers';

import { SpinnerLoader } from '~shared/Preloaders';
// import LoadMoreButton from '~shared/LoadMoreButton';
import { SortOptions } from '~shared/SortControls';
import ActionsList from '~shared/ActionsList';
import { ActionButton } from '~shared/Button';
import { ActionTypes } from '~redux';
import { useColonyContext } from '~hooks';
import { useGetColonyActionsQuery } from '~gql';
import { notNull } from '~utils/arrays';

import { actionsSort, ActionsListHeading } from '.';

import styles from './ColonyActions.css';

const displayName = 'common.ColonyActions';

const MSG = defineMessages({
  noActionsFound: {
    id: `${displayName}.noActionsFound`,
    defaultMessage: 'There are no actions yet',
  },
  loading: {
    id: `${displayName}.loading`,
    defaultMessage: `Loading Actions`,
  },
});

// type Props = {
//   ethDomainId?: number;
// };

const ColonyActions = (/* { ethDomainId }: Props */) => {
  const { colony } = useColonyContext();

  const { data, loading: loadingActions } = useGetColonyActionsQuery({
    variables: {
      colonyAddress: colony?.colonyAddress ?? '',
    },
    skip: !colony,
  });
  const actions = data?.getActionsByColony?.items.filter(notNull) ?? [];

  const [sortOption, setSortOption] = useState<SortOptions>(SortOptions.NEWEST);

  if (!colony) {
    return null;
  }

  //   const { data: extensions } = useColonyExtensionsQuery({
  //     variables: { address: colonyAddress },
  //   });
  //   const { installedExtensions } = extensions?.processedColony || {};

  //   const { data: oneTxActions, loading: oneTxActionsLoading } =
  //     useSubgraphOneTxSubscription({
  //       variables: {
  //         /*
  //          * @NOTE We always need to fetch one more item so that we know that more
  //          * items exist and we show the "load more" button
  //          */
  //         colonyAddress: colonyAddress?.toLowerCase(),
  //         sortDirection: 'desc',
  //       },
  //     });

  //   const { data: eventsActions, loading: eventsActionsLoading } =
  //     useSubgraphEventsThatAreActionsSubscription({
  //       variables: {
  //         /*
  //          * @NOTE We always need to fetch one more item so that we know that more
  //          * items exist and we show the "load more" button
  //          */
  //         colonyAddress: colonyAddress?.toLowerCase(),
  //         sortDirection: 'desc',
  //       },
  //     });

  //   const { data: commentCount, loading: commentCountLoading } =
  //     useCommentCountSubscription({
  //       variables: { colonyAddress },
  //     });

  //   const { data: actionStatuses, loading: actionStatusesLoading } =
  //     useActionsThatNeedAttentionQuery({
  //       variables: {
  //         colonyAddress,
  //         walletAddress,
  //       },
  //     });

  //   const votingReputationExtension = installedExtensions?.find(
  //     ({ extensionId }) => extensionId === Extension.VotingReputation,
  //   );

  //   const { data: motions } = useSubgraphMotionsSubscription({
  //     variables: {
  //       /*
  //        * @NOTE We always need to fetch one more item so that we know that more
  //        * items exist and we show the "load more" button
  //        */
  //       colonyAddress: colonyAddress?.toLowerCase(),
  //       extensionAddress: votingReputationExtension?.address?.toLowerCase() || '',
  //       motionActionNot: ACTION_DECISION_MOTION_CODE,
  //     },
  //   });

  //   const actions = useTransformer(getActionsListData, [
  //     installedExtensions?.map(({ address }) => address) as string[],
  //     { ...oneTxActions, ...eventsActions, ...motions },
  //     commentCount?.transactionMessagesCount,
  //     {
  //       extensionAddresses: extensionAddresses as Address[],
  //       actionsThatNeedAttention:
  //         actionStatuses?.actionsThatNeedAttention as ActionThatNeedsAttention[],
  //     },
  //   ]);

  //   const filteredActions = useMemo(() => {
  //     const filterActions = !ethDomainId
  //       ? actions
  //       : actions.filter(
  //           (action) =>
  //             Number(action.fromDomain) === ethDomainId ||
  //             /* when no specific domain in the action it is displayed in Root */
  //             (ethDomainId === 1 && action.fromDomain === undefined) ||
  //             /* when transfering funds the list shows both sender & recipient */
  //             (action.actionType === ColonyActionTypes.MoveFunds &&
  //               Number(action.toDomain) === ethDomainId),
  //         );

  //     /* filter out duplicate action items on passed motions */
  //     if (motions && motions.motions?.length > 0) {
  //       const motionExtensionAddresses =
  //         motions.motions
  //           .filter((motion) => motion.extensionAddress)
  //           .map((motion) => createAddress(motion.extensionAddress)) || [];
  //       if (motionExtensionAddresses.length > 0) {
  //         return filterActions.filter((action) => {
  //           return !motionExtensionAddresses.includes(
  //             createAddress(action.initiator),
  //           );
  //         });
  //       }
  //     }

  //     return filterActions;
  //   }, [ethDomainId, actions, motions]);

  const sortedActionsData = actions.sort(actionsSort(sortOption));

  //   oneTxActionsLoading ||
  //   eventsActionsLoading ||
  //   commentCountLoading ||
  //   actionStatusesLoading ||
  //   !commentCount ||
  //   !oneTxActions ||
  //   !eventsActions

  if (loadingActions) {
    return (
      <div className={styles.loadingSpinner}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ theme: 'primary', size: 'massive' }}
        />
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <ActionButton
        submit={ActionTypes.ACTION_MINT_TOKENS}
        error={ActionTypes.ACTION_MINT_TOKENS_ERROR}
        success={ActionTypes.ACTION_MINT_TOKENS_SUCCESS}
        values={{
          colonyAddress: colony.colonyAddress,
          colonyName: colony.name,
          nativeTokenAddress: colony.nativeToken.tokenAddress,
          amount: BigNumber.from(1),
        }}
        text="Test Mint Tokens"
      />
      {sortedActionsData.length ? (
        <>
          <ActionsListHeading onSortChange={setSortOption} />
          <ActionsList items={sortedActionsData} />
          {/* {loadMoreItems && (
            <LoadMoreButton
              onClick={showMoreItems}
              isLoadingData={false} // oneTxActionsLoading || eventsActionsLoading}
            />
          )} */}
        </>
      ) : (
        <div className={styles.emptyState}>
          <FormattedMessage {...MSG.noActionsFound} />
        </div>
      )}
    </div>
  );
};

ColonyActions.displayName = displayName;

export default ColonyActions;
