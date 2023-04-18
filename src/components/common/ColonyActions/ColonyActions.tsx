import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { BigNumber } from 'ethers';
import { useNavigate } from 'react-router-dom';

import { SpinnerLoader } from '~shared/Preloaders';
import LoadMoreButton from '~shared/LoadMoreButton';
import ActionsList from '~shared/ActionsList';
import { ActionButton } from '~shared/Button';
import {
  useAppContext,
  useColonyContext,
  useEnabledExtensions,
  usePaginatedActions,
} from '~hooks';
import { mergePayload, pipe, withMeta } from '~utils/actions';
import { ActionTypes, RootMotionMethodNames } from '~redux';

import { ActionsListHeading } from '.';

import styles from './ColonyActions.css';
import { DomainColor } from '~gql';

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

  // only to test root motion saga
  const { isVotingReputationEnabled } = useEnabledExtensions();

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

  const isForce = false;
  const isMotion = !!isVotingReputationEnabled && !isForce;
  const actionType = isMotion
    ? ActionTypes.ROOT_MOTION
    : ActionTypes.ACTION_MINT_TOKENS;

  const amount = BigNumber.from(1);
  const transform = withMeta({ navigate });

  return (
    <div className={styles.main}>
      <ActionButton
        actionType={actionType}
        values={{
          operationName: RootMotionMethodNames.MintTokens,
          colonyAddress: colony.colonyAddress,
          colonyName: colony.name,
          nativeTokenAddress: colony.nativeToken.tokenAddress,
          motionParams: [amount],
          amount,
        }}
        transform={transform}
        text="Test Mint Tokens"
      />
      <ActionButton
        actionType={
          isMotion
            ? ActionTypes.MOTION_EXPENDITURE_PAYMENT
            : ActionTypes.ACTION_EXPENDITURE_PAYMENT
        }
        error={ActionTypes.ACTION_EXPENDITURE_PAYMENT_ERROR}
        success={ActionTypes.ACTION_EXPENDITURE_PAYMENT_SUCCESS}
        transform={pipe(
          mergePayload({
            motionDomainId: '1',
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
        actionType={ActionTypes.ACTION_DOMAIN_CREATE}
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
        actionType={ActionTypes.ACTION_DOMAIN_EDIT}
        error={ActionTypes.ACTION_DOMAIN_EDIT_ERROR}
        success={ActionTypes.ACTION_DOMAIN_EDIT_SUCCESS}
        transform={pipe(
          mergePayload({
            colonyAddress: colony.colonyAddress,
            colonyName: colony.name,
            domain: colony.domains?.items.find((d) => !d?.isRoot),
            domainName: 'New Name',
            domainColor: DomainColor.Magenta,
            domainPurpose: 'New Description',
          }),
          withMeta({ navigate }),
        )}
        text="Test Edit Domain"
      />
      <ActionButton
        actionType={ActionTypes.ACTION_UNLOCK_TOKEN}
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
        actionType={
          isMotion
            ? ActionTypes.MOTION_MOVE_FUNDS
            : ActionTypes.ACTION_MOVE_FUNDS
        }
        error={ActionTypes.ACTION_MOVE_FUNDS_ERROR}
        success={ActionTypes.ACTION_MOVE_FUNDS_SUCCESS}
        transform={pipe(
          mergePayload({
            colonyAddress: colony.colonyAddress,
            colonyName: colony.name,
            version: colony.version,
            fromDomain: colony.domains?.items.find((d) => d?.isRoot),
            toDomain: colony.domains?.items.find((d) => !d?.isRoot),
            amount: BigNumber.from(5).mul(BigNumber.from(10).pow(17)), // this is in wei
            tokenAddress: colony.nativeToken.tokenAddress,
          }),
          withMeta({ navigate }),
        )}
        text="Test Move Funds"
      />
      <ActionButton
        actionType={ActionTypes.ACTION_EDIT_COLONY}
        error={ActionTypes.ACTION_EDIT_COLONY_ERROR}
        success={ActionTypes.ACTION_EDIT_COLONY_SUCCESS}
        transform={pipe(
          mergePayload({
            colony,
            colonyDisplayName: 'New Colony Name',
          }),
          withMeta({ navigate }),
        )}
        text="Test Edit Colony"
      />
      <ActionButton
        actionType={
          isMotion
            ? ActionTypes.ROOT_MOTION
            : ActionTypes.ACTION_VERSION_UPGRADE
        }
        error={ActionTypes.ACTION_VERSION_UPGRADE_ERROR}
        success={ActionTypes.ACTION_VERSION_UPGRADE_SUCCESS}
        transform={pipe(
          mergePayload({
            colonyAddress: colony.colonyAddress,
            colonyName: colony.name,
            version: colony.version,
            operationName: RootMotionMethodNames.Upgrade,
            motionParams: [colony.version],
          }),
          withMeta({ navigate }),
        )}
        text="Test Version Upgrade"
      />
      <ActionButton
        actionType={ActionTypes.ACTION_MANAGE_REPUTATION}
        error={ActionTypes.ACTION_MANAGE_REPUTATION_ERROR}
        success={ActionTypes.ACTION_MANAGE_REPUTATION_SUCCESS}
        transform={pipe(
          mergePayload({
            colonyAddress: colony.colonyAddress,
            colonyName: colony.name,
            domainId: colony.domains?.items[0]?.nativeId,
            walletAddress: user?.walletAddress,
            amount: BigNumber.from(1).mul(BigNumber.from(10).pow(18)),
            isSmitingReputation: false,
          }),
          withMeta({ navigate }),
        )}
        text="Test Manage Reputation"
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
