import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { BigNumber } from 'ethers';
import { useNavigate } from 'react-router-dom';

import { SpinnerLoader } from '~shared/Preloaders';
import LoadMoreButton from '~shared/LoadMoreButton';
import ActionsList from '~shared/ActionsList';
import { ActionButton } from '~shared/Button';
import { ActionTypes } from '~redux';
import { useAppContext, useColonyContext, usePaginatedActions } from '~hooks';
import { mergePayload, pipe, withMeta } from '~utils/actions';
import { DomainColor } from '~types';

import { ActionsListHeading } from '.';

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
  const navigate = useNavigate();
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const {
    loading: loadingActions,
    actions,
    sortDirection,
    onSortDirectionChange,
    hasMoreActions,
    loadMoreActions,
  } = usePaginatedActions();

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
        transform={pipe(
          mergePayload({
            colonyAddress: colony.colonyAddress,
            colonyName: colony.name,
            nativeTokenAddress: colony.nativeToken.tokenAddress,
            amount: BigNumber.from(5).mul(BigNumber.from(10).pow(18)), // this is in wei
          }),
          withMeta({ navigate }),
        )}
        text="Test Mint Tokens"
      />
      <ActionButton
        submit={ActionTypes.ACTION_EXPENDITURE_PAYMENT}
        error={ActionTypes.ACTION_EXPENDITURE_PAYMENT_ERROR}
        success={ActionTypes.ACTION_EXPENDITURE_PAYMENT_SUCCESS}
        transform={pipe(
          mergePayload({
            colonyAddress: colony.colonyAddress,
            colonyName: colony.name,
            recipientAddress: user?.walletAddress,
            domainId: colony.domains?.items[0]?.nativeId,
            singlePayment: {
              amount: BigNumber.from(2), // this is in ethers
              tokenAddress: colony.nativeToken.tokenAddress,
              decimals: 18,
            },
          }),
          withMeta({ navigate }),
        )}
        text="Test Create Payment"
      />
      <ActionButton
        submit={ActionTypes.ACTION_DOMAIN_CREATE}
        error={ActionTypes.ACTION_DOMAIN_CREATE_ERROR}
        success={ActionTypes.ACTION_DOMAIN_CREATE_SUCCESS}
        transform={pipe(
          mergePayload({
            colonyAddress: colony.colonyAddress,
            colonyName: colony.name,
            domainName: 'Test Domain',
            domainColor: DomainColor.BlueGrey,
            domainPurpose: 'Test Domain Description',
          }),
          withMeta({ navigate }),
        )}
        text="Test Create Domain"
      />
      <ActionButton
        submit={ActionTypes.ACTION_DOMAIN_EDIT}
        error={ActionTypes.ACTION_DOMAIN_EDIT_ERROR}
        success={ActionTypes.ACTION_DOMAIN_EDIT_SUCCESS}
        transform={pipe(
          mergePayload({
            colonyAddress: colony.colonyAddress,
            colonyName: colony.name,
            domainId: colony.domains?.items.find((d) => !d?.isRoot)?.nativeId,
            domainName: 'Edited Test Domain',
            domainColor: DomainColor.Green,
            domainPurpose: 'Edited Test Domain Description',
          }),
          withMeta({ navigate }),
        )}
        text="Test Edit Domain"
      />
      <ActionButton
        submit={ActionTypes.ACTION_UNLOCK_TOKEN}
        error={ActionTypes.ACTION_UNLOCK_TOKEN_ERROR}
        success={ActionTypes.ACTION_UNLOCK_TOKEN_SUCCESS}
        transform={pipe(
          mergePayload({
            colonyAddress: colony.colonyAddress,
            colonyName: colony.name,
          }),
          withMeta({ navigate }),
        )}
        text="Test Unlock Token"
      />
      <ActionButton
        submit={ActionTypes.ACTION_MOVE_FUNDS}
        error={ActionTypes.ACTION_MOVE_FUNDS_ERROR}
        success={ActionTypes.ACTION_MOVE_FUNDS_SUCCESS}
        transform={pipe(
          mergePayload({
            colonyAddress: colony.colonyAddress,
            colonyName: colony.name,
            fromDomain: colony.domains?.items.find((d) => d?.isRoot),
            toDomain: colony.domains?.items.find((d) => !d?.isRoot),
            amount: BigNumber.from(5).mul(BigNumber.from(10).pow(17)), // this is in wei
            tokenAddress: colony.nativeToken.tokenAddress,
          }),
          withMeta({ navigate }),
        )}
        text="Test Move Funds"
      />
      {actions.length ? (
        <>
          <ActionsListHeading
            sortDirection={sortDirection}
            onSortChange={onSortDirectionChange}
          />
          <ActionsList items={actions} />
          {hasMoreActions && (
            <LoadMoreButton
              onClick={loadMoreActions}
              isLoadingData={loadingActions} // oneTxActionsLoading || eventsActionsLoading}
            />
          )}
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
