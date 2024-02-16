import clsx from 'clsx';
import React, { type FC, useEffect, useState } from 'react';

import { apolloClient } from '~apollo';
import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import { ColonyActionType } from '~gql';
import { ActionTypes } from '~redux/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import Icon from '~shared/Icon/index.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import { getSafePollingInterval } from '~utils/queries.ts';
import PillsBase from '~v5/common/Pills/index.ts';
import Button, { TxButton } from '~v5/shared/Button/index.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';

import DescriptionList from '../VotingStep/partials/DescriptionList/index.ts';

import { useClaimConfig, useFinalizeStep } from './hooks.tsx';
import { type FinalizeStepProps, FinalizeStepSections } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.FinalizeStep';

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
  const { isFinalizable, transform: finalizePayload } =
    useFinalizeStep(actionData);
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

      switch (actionData.type) {
        case ColonyActionType.AddVerifiedMembersMotion:
        case ColonyActionType.RemoveVerifiedMembersMotion: {
          apolloClient.cache.evict({ fieldName: 'getContributorsByColony' });
          break;
        }
        default: {
          break;
        }
      }
    }
  }, [actionData.motionData.isFinalized, actionData.type, refetchColony]);

  let action = {
    actionType: ActionTypes.MOTION_FINALIZE,
    transform: finalizePayload,
    onSuccess: handleSuccess,
  };
  if (
    actionData.motionData.isFinalized ||
    actionData.motionData.motionStateHistory.hasFailedNotFinalizable
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
        status: 'info',
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
          //     <Icon name="arrows-clockwise" appearance={{ size: 'tiny' }} />
          //   </span>
          //   {formatText(
          //     { id: 'motion.finalizeStep.transactions.remaining' },
          //     { transactions: remainingStakesNumber },
          //   )}
          // </div>
        ),
        iconSize: 'extraSmall',
      }}
      sections={[
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
                      (!actionData.motionData.isFinalized && isFinalizable) ||
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
                          <Icon
                            name="spinner-gap"
                            className="animate-spin"
                            appearance={{ size: 'tiny' }}
                          />
                        </span>
                      }
                    />
                  )}
                  {!isPolling &&
                    !actionData.motionData.isFinalized &&
                    isFinalizable && (
                      <Button
                        mode="primarySolid"
                        disabled={!isFinalizable || wrongMotionState}
                        isFullSize
                        text={formatText({ id: 'motion.finalizeStep.submit' })}
                        type="submit"
                      />
                    )}
                  {!isPolling &&
                    (actionData.motionData.isFinalized ||
                      actionData.motionData.motionStateHistory
                        .hasFailedNotFinalizable) &&
                    !isClaimed &&
                    canClaimStakes && (
                      <Button
                        mode="primarySolid"
                        disabled={!canClaimStakes || wrongMotionState}
                        isFullSize
                        text={formatText({
                          id: buttonTextId,
                        })}
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
