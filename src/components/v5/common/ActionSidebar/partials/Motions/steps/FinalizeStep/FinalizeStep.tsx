import { SpinnerGap } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ColonyActionType } from '~gql';
import { ActionTypes } from '~redux/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import { getSafePollingInterval } from '~utils/queries.ts';
import PillsBase from '~v5/common/Pills/index.ts';
import Button, { TxButton } from '~v5/shared/Button/index.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';

import DescriptionList from '../VotingStep/partials/DescriptionList/index.ts';

import { useClaimConfig, useFinalizeStep } from './hooks.tsx';
import { type FinalizeStepProps, FinalizeStepSections } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.FinalizeStep';

const MSG = defineMessages({
  finalizeError: {
    id: `${displayName}.finalizeError`,
    defaultMessage: `There are not enough funds in the team to finalize. Ensure there are enough funds in the team before trying again.`,
  },
});

const FinalizeStep: FC<FinalizeStepProps> = ({
  actionData,
  startPollingAction,
  stopPollingAction,
  refetchAction,
  motionState,
}) => {
  const { canInteract } = useAppContext();
  const [isPolling, setIsPolling] = useState(false);
  const { refetchColony } = useColonyContext();
  const {
    isFinalizable,
    transform: finalizePayload,
    hasEnoughFundsToFinalize,
  } = useFinalizeStep(actionData);
  const {
    items,
    isClaimed,
    buttonTextId,
    // remainingStakesNumber,
    handleClaimSuccess,
    claimPayload,
    canClaimStakes,
  } = useClaimConfig(actionData, startPollingAction, refetchAction);

  const handleSuccess = () => {
    startPollingAction(getSafePollingInterval());
    setIsPolling(true);
  };

  /* Stop polling when mounted / dismounted */
  useEffect(() => {
    if (isClaimed) {
      stopPollingAction();
      setIsPolling(false);
    }
    return stopPollingAction;
  }, [isClaimed, stopPollingAction]);

  /* Update colony object when motion gets finalized. */
  useEffect(() => {
    if (actionData.motionData.isFinalized) {
      refetchColony();
      setIsPolling(false);
    }
  }, [actionData.motionData.isFinalized, refetchColony]);

  let action = {
    actionType: ActionTypes.MOTION_FINALIZE,
    transform: finalizePayload,
    onSuccess: handleSuccess,
  };
  if (
    actionData.motionData.isFinalized ||
    actionData.motionData.motionStateHistory.hasFailedNotFinalizable ||
    actionData.type === ColonyActionType.CreateDecisionMotion
  ) {
    action = {
      actionType: ActionTypes.MOTION_CLAIM,
      transform: claimPayload,
      onSuccess: handleClaimSuccess,
    };
  }

  /*
   * @NOTE This is just needed until we properly save motion data in the db
   * For now, we just fetch it live from chain, so when we uninstall the extension
   * that state check will fail, and old motions cannot be interacted with anymore
   */
  const wrongMotionState = !motionState || motionState === MotionState.Invalid;

  return (
    <MenuWithStatusText
      statusTextSectionProps={{
        status: StatusTypes.Info,
        children: formatText({ id: 'motion.finalizeStep.statusText' }),
        textClassName: 'text-4',
        iconAlignment: 'top',
        content: (
          <div />
          /*
           * @TODO This needs to refactored
           * When the claim single / claim for everyone multicall logic gets wired in
           */
          // <div className="flex items-center text-4 gap-2">
          //   <span className="flex text-blue-400 mr-2">
          //     <ArrowsClockwise size={14} />
          //   </span>
          //   {formatText(
          //     { id: 'motion.finalizeStep.transactions.remaining' },
          //     { transactions: remainingStakesNumber },
          //   )}
          // </div>
        ),
        iconSize: 16,
      }}
      sections={[
        ...(!hasEnoughFundsToFinalize
          ? [
              {
                key: `${actionData.motionData.transactionHash}-not-enough-balance`,
                content: (
                  <p className="text-sm">{formatText(MSG.finalizeError)}</p>
                ),
                className: 'bg-negative-100 text-negative-400',
              },
            ]
          : []),
        {
          key: FinalizeStepSections.Finalize,
          content: (
            <ActionForm {...action} onSuccess={handleSuccess}>
              <div className="mb-2">
                <h4 className="text-1 mb-3 flex justify-between items-center">
                  {formatText({ id: 'motion.finalizeStep.title' })}
                  {isClaimed && (
                    <PillsBase className="bg-teams-pink-100 text-teams-pink-500">
                      {formatText({ id: 'motion.finalizeStep.claimed' })}
                    </PillsBase>
                  )}
                </h4>
              </div>
              {items && (
                <DescriptionList
                  items={items}
                  className={clsx({
                    'mb-6':
                      !actionData.motionData.isFinalized ||
                      (!isClaimed && canClaimStakes),
                  })}
                />
              )}
              {canInteract && (
                <>
                  {isPolling && (
                    <TxButton
                      className="w-full"
                      rounded="s"
                      text={{ id: 'button.pending' }}
                      icon={
                        <span className="flex shrink-0 ml-1.5">
                          <SpinnerGap size={14} className="animate-spin" />
                        </span>
                      }
                    />
                  )}
                  {!isPolling &&
                    !actionData.motionData.isFinalized &&
                    actionData.type !==
                      ColonyActionType.CreateDecisionMotion && (
                      <Button
                        mode="primarySolid"
                        disabled={!isFinalizable || wrongMotionState}
                        isFullSize
                        text={formatText({
                          id: 'motion.finalizeStep.submit',
                        })}
                        type="submit"
                      />
                    )}
                  {!isPolling &&
                    (actionData.motionData.isFinalized ||
                      actionData.motionData.motionStateHistory
                        .hasFailedNotFinalizable ||
                      actionData.type ===
                        ColonyActionType.CreateDecisionMotion) &&
                    !isClaimed &&
                    canClaimStakes && (
                      <Button
                        mode="primarySolid"
                        disabled={!canClaimStakes || wrongMotionState}
                        isFullSize
                        text={
                          actionData.type ===
                          ColonyActionType.CreateDecisionMotion
                            ? formatText('Return Stakes')
                            : formatText({ id: buttonTextId })
                        }
                        type="submit"
                      />
                    )}
                </>
              )}
            </ActionForm>
          ),
        },
      ]}
    />
  );
};

FinalizeStep.displayName = displayName;

export default FinalizeStep;
