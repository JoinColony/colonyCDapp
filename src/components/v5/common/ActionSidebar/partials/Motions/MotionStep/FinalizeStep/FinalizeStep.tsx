import React, { type FC, useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useColonyTriggersContext } from '~context/GlobalTriggersContext/ColonyTriggersContext.ts';
import { ColonyActionType } from '~gql';
import usePrevious from '~hooks/usePrevious.ts';
import { ActionTypes } from '~redux/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import { useFinalizeSuccessCallback } from '~v5/common/ActionSidebar/partials/hooks.ts';
import { handleMotionCompleted } from '~v5/common/ActionSidebar/utils.ts';
import Button from '~v5/shared/Button/index.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';
import StatusText from '~v5/shared/StatusText/StatusText.tsx';

import { useClaimConfig, useFinalizeStep } from './hooks.tsx';
import { FinalizeStepContent } from './partials/FinalizeStepContent.tsx';
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
  action,
  motionData,
  motionState,
}) => {
  const { onFinalizeSuccessCallback } = useFinalizeSuccessCallback();

  const { canInteract } = useAppContext();

  const [isPolling, setIsPolling] = useState(false);

  const { refetchColony } = useColonyContext();

  const {
    isFinalizable,
    transform: finalizePayload,
    hasEnoughFundsToFinalize,
  } = useFinalizeStep({ action, motionData });

  const {
    items,
    isClaimed,
    buttonTextId,
    // remainingStakesNumber,
    handleClaimSuccess,
    claimPayload,
    canClaimStakes,
    hasUserStake,
  } = useClaimConfig({ action, motionData });

  const { type: actionType } = action;

  const {
    isFinalized: isMotionFinalized,
    motionStateHistory: {
      hasFailedNotFinalizable: isMotionFailedNotFinalizable,
    },
    transactionHash: motionTransactionHash,
  } = motionData;

  const { setActionsTableTriggers } = useColonyTriggersContext();

  const previousIsMotionFinalized = usePrevious(isMotionFinalized);
  const isMotionFailed = motionData.motionStateHistory.hasFailed;
  const isMotionAgreement =
    action.type === ColonyActionType.CreateDecisionMotion;
  const isMotionClaimable = isMotionFinalized && !isClaimed;
  const isAgreementClaimable =
    ((isMotionFinalized || isMotionFailedNotFinalizable) &&
      !isMotionFailed &&
      !isMotionFailedNotFinalizable) ||
    (isMotionAgreement && !isClaimed);

  const handleSuccess = () => {
    setIsPolling(true);
    onFinalizeSuccessCallback(action);
  };

  /* Update colony object when motion gets finalized or is agreement. */
  useEffect(() => {
    if (
      (isMotionAgreement || isMotionFinalized) &&
      previousIsMotionFinalized === false
    ) {
      refetchColony();
      setIsPolling(false);
      setActionsTableTriggers((triggers) => ({
        ...triggers,
        shouldRefetchMotionStates: true,
      }));
      handleMotionCompleted(action);
    }
  }, [
    isMotionAgreement,
    isMotionFinalized,
    previousIsMotionFinalized,
    motionData,
    refetchColony,
    setActionsTableTriggers,
    action,
  ]);

  /*
   * @NOTE This is just needed until we properly save motion data in the db
   * For now, we just fetch it live from chain, so when we uninstall the extension
   * that state check will fail, and old motions cannot be interacted with anymore
   */
  const wrongMotionState = !motionState || motionState === MotionState.Invalid;

  const statusId = (() => {
    if (isMotionAgreement) {
      const userNotStakeOrClaimedText = isMotionFailed
        ? 'motion.finalizeStep.finalizeAgreement.failed'
        : 'motion.finalizeStep.finalizeAgreement.supported';

      const userStakeUnclaimedText = isMotionFailed
        ? 'motion.finalizeStep.claimable.finalizeAgreement.failed'
        : 'motion.finalizeStep.claimable.finalizeAgreement.passed';

      return isClaimed || !hasUserStake
        ? userNotStakeOrClaimedText
        : userStakeUnclaimedText;
    }

    return isMotionFailedNotFinalizable
      ? 'motion.finalizeStep.failed.statusText'
      : 'motion.finalizeStep.statusText';
  })();

  const showFinalizeButton =
    !isMotionFailedNotFinalizable && !isMotionFinalized && !isMotionAgreement;

  const showClaimButton =
    (isMotionClaimable && canClaimStakes && !isClaimed && hasUserStake) ||
    (isMotionAgreement && isAgreementClaimable && hasUserStake && !isClaimed);
  const canBeExecuted =
    !isPolling &&
    !isMotionFailedNotFinalizable &&
    !isMotionFinalized &&
    !isMotionAgreement;

  const supportedStatusText = canBeExecuted
    ? 'motion.finalizeStep.passedAction'
    : 'motion.finalizeStep.completedStatusText';

  const finalizeStatusText = isMotionFailed
    ? 'motion.finalizeStep.opposedAction'
    : supportedStatusText;

  const statusText = isMotionFailedNotFinalizable
    ? 'motion.finalizeStep.failed.statusText'
    : finalizeStatusText;

  return (
    <MenuWithStatusText
      statusText={
        <StatusText
          status={StatusTypes.Info}
          textClassName="text-4 text-gray-900"
          iconAlignment="top"
          iconSize={16}
        >
          {actionType === ColonyActionType.CreateDecisionMotion
            ? formatText({ id: statusId })
            : formatText({
                id: statusText,
              })}
        </StatusText>
      }
      content={
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
      }
      sections={[
        ...(!hasEnoughFundsToFinalize
          ? [
              {
                key: `${motionTransactionHash}-not-enough-balance`,
                content: (
                  <p className="text-sm">{formatText(MSG.finalizeError)}</p>
                ),
                className: 'bg-negative-100 text-negative-400 !py-3',
              },
            ]
          : []),
        {
          key: FinalizeStepSections.Finalize,
          content: (
            <ActionForm
              actionType={
                isMotionClaimable
                  ? ActionTypes.MOTION_CLAIM
                  : ActionTypes.MOTION_FINALIZE
              }
              transform={isMotionClaimable ? claimPayload : finalizePayload}
              onSuccess={isMotionClaimable ? handleClaimSuccess : handleSuccess}
            >
              {(formHelpers) => (
                <FinalizeStepContent
                  formHelpers={formHelpers}
                  items={items}
                  showButton={canInteract}
                  showClaimedPill={isClaimed && canClaimStakes}
                  isPolling={isPolling}
                  shouldResetFormState={
                    !showFinalizeButton && !previousIsMotionFinalized
                  }
                  isClaimed={isClaimed}
                >
                  {(showFinalizeButton || showClaimButton) && (
                    <>
                      {showFinalizeButton && (
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
                      {showClaimButton && (
                        <Button
                          mode="primarySolid"
                          disabled={
                            !canClaimStakes ||
                            wrongMotionState ||
                            formHelpers.formState.isSubmitting
                          }
                          isFullSize
                          text={formatText({
                            id: isMotionAgreement
                              ? 'motion.finalizeStep.returnStakes'
                              : buttonTextId,
                          })}
                          type="submit"
                        />
                      )}
                    </>
                  )}
                </FinalizeStepContent>
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
