import { ArrowsClockwise } from '@phosphor-icons/react';
import React, { type FC, useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import { ActionTypes } from '~redux';
import { type ClaimExpenditurePayload } from '~redux/sagas/expenditures/claimExpenditure.ts';
import { type ReclaimExpenditureStakePayload } from '~redux/sagas/expenditures/reclaimExpenditureStake.ts';
import {
  getClaimableExpenditurePayouts,
  getExpenditureCreatingActionId,
} from '~utils/expenditures.ts';
import { formatText } from '~utils/intl.ts';
import { CacheQueryKeys, removeCacheEntry } from '~utils/queries.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';
import { LoadingBehavior } from '~v5/shared/Button/types.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';
import StatusText from '~v5/shared/StatusText/index.ts';

import PaymentCounter from '../PaymentCounter/PaymentCounter.tsx';

import PaymentOverview from './partials/PaymentOverview/PaymentOverview.tsx';
import { type PaymentStepDetailsBlockProps } from './types.ts';
import { getSummedTokens } from './utils.ts';

const PaymentStepDetailsBlock: FC<PaymentStepDetailsBlockProps> = ({
  expenditure,
  isWaitingForClaimedPayouts,
}) => {
  const { colony } = useColonyContext();
  const { currentBlockTime: blockTime, fetchCurrentBlockTime } =
    useCurrentBlockTime();

  const {
    slots = [],
    finalizedAt,
    nativeId,
    userStake,
    isStaked,
  } = expenditure || {};
  const { isClaimed: isStakeClaimed } = userStake || {};

  const claimablePayouts = useMemo(
    () => getClaimableExpenditurePayouts(slots, blockTime, finalizedAt),
    [blockTime, finalizedAt, slots],
  );

  const allPayouts = useMemo(
    () =>
      slots.flatMap(
        ({ payouts, claimDelay, id }) =>
          payouts?.map((payout) => ({
            ...payout,
            slotId: id,
            claimDelay: claimDelay || '0',
          })) || [],
      ) || [],
    [slots],
  );

  const totals = getSummedTokens(allPayouts);
  const paid = getSummedTokens(allPayouts, true);
  const summedClaimablePayouts = getSummedTokens(claimablePayouts);

  const payable = summedClaimablePayouts.length
    ? summedClaimablePayouts
    : totals.map((payout) => ({ ...payout, amount: '0' }));

  const leftToClaim = useMemo(
    () =>
      allPayouts
        .filter(
          ({ isClaimed, slotId }) =>
            !isClaimed &&
            !claimablePayouts.find(
              ({ slotId: payableSlotId }) => payableSlotId === slotId,
            ),
        )
        .sort((a, b) => Number(a.claimDelay) - Number(b.claimDelay)),
    [allPayouts, claimablePayouts],
  );
  const closestPayoutClaimDelay = leftToClaim.length
    ? leftToClaim[0].claimDelay
    : '0';

  const allPaid = !allPayouts.find(({ isClaimed }) => !isClaimed);

  const claimPayload: ClaimExpenditurePayload | undefined = nativeId
    ? {
        associatedActionId: getExpenditureCreatingActionId(expenditure),
        colonyAddress: colony.colonyAddress,
        claimablePayouts,
        nativeExpenditureId: nativeId,
      }
    : undefined;

  const reclaimExpenditureStake = useAsyncFunction({
    submit: ActionTypes.RECLAIM_EXPENDITURE_STAKE,
    error: ActionTypes.RECLAIM_EXPENDITURE_STAKE_ERROR,
    success: ActionTypes.RECLAIM_EXPENDITURE_STAKE_SUCCESS,
  });

  const handleReclaimStake = async () => {
    if (!expenditure) {
      return;
    }

    const payload: ReclaimExpenditureStakePayload = {
      associatedActionId: getExpenditureCreatingActionId(expenditure),
      colonyAddress: colony.colonyAddress,
      nativeExpenditureId: expenditure?.nativeId,
    };

    await reclaimExpenditureStake(payload);
  };

  if (!finalizedAt) {
    return null;
  }

  return allPaid ? (
    <PaymentOverview
      className="rounded-lg border border-gray-200 bg-base-white px-[1.125rem] pb-3.5 pt-[1.125rem]"
      total={totals}
      paid={paid}
      payable={payable}
    />
  ) : (
    <MenuWithStatusText
      statusText={
        <StatusText
          status={StatusTypes.Info}
          textClassName="text-4 text-gray-900"
          iconAlignment="top"
          iconClassName="text-gray-500"
          iconSize={16}
        >
          {formatText({ id: 'expenditure.paymentStage.info' })}
        </StatusText>
      }
      content={
        leftToClaim.length ? (
          <StatusText
            icon={ArrowsClockwise}
            iconAlignment="top"
            iconSize={16}
            status={StatusTypes.Info}
            textClassName="text-4 text-gray-900"
            className="mt-2"
            iconClassName="text-gray-500"
          >
            {formatText(
              { id: 'expenditure.paymentStage.info.nextClaim' },
              {
                counter: (
                  <PaymentCounter
                    finalizedTimestamp={finalizedAt}
                    claimDelay={closestPayoutClaimDelay}
                    onTimeEnd={fetchCurrentBlockTime}
                  />
                ),
              },
            )}
          </StatusText>
        ) : undefined
      }
      sections={[
        {
          key: 'overview',
          className: '!p-[1.125rem]',
          content: (
            <div>
              <PaymentOverview total={totals} paid={paid} payable={payable} />
              <ActionButton
                actionType={ActionTypes.EXPENDITURE_CLAIM}
                className="mt-4"
                mode="primarySolid"
                disabled={
                  !claimablePayouts.length ||
                  !blockTime ||
                  isWaitingForClaimedPayouts
                }
                values={claimPayload}
                text={formatText({ id: 'expenditure.paymentStage.button' })}
                loadingBehavior={LoadingBehavior.TxLoader}
                isFullSize
                onSuccess={async () => {
                  if (isStaked && !isStakeClaimed) {
                    await handleReclaimStake();
                  }

                  fetchCurrentBlockTime();

                  // When a payment has been claimed successfully
                  // we need to remove all getDomainBalance queries to refetch the correct balances
                  removeCacheEntry(CacheQueryKeys.GetDomainBalance);
                }}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default PaymentStepDetailsBlock;
