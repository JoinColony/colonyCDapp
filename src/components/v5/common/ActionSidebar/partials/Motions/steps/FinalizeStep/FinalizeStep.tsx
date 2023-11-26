import React, { FC, useEffect, useState } from 'react';
import { ActionTypes } from '~redux';

import { formatText } from '~utils/intl';
import Button, { TxButton } from '~v5/shared/Button';
import { ActionForm } from '~shared/Fields';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText';
import DescriptionList from '../VotingStep/partials/DescriptionList';
import { useClaimConfig, useFinalizeStep } from './hooks';
import { FinalizeStepProps, FinalizeStepSections } from './types';
import PillsBase from '~v5/common/Pills';
import { useAppContext, useColonyContext } from '~hooks';
import Icon from '~shared/Icon';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.FinalizeStep';

const FinalizeStep: FC<FinalizeStepProps> = ({
  actionData,
  startPollingAction,
  stopPollingAction,
  refetchAction,
}) => {
  const { user } = useAppContext();
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
    startPollingAction(1000);
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
    }
  }, [actionData.motionData.isFinalized, refetchColony]);

  let action = {
    actionType: ActionTypes.MOTION_FINALIZE,
    transform: finalizePayload,
    onSuccess: handleSuccess,
  };
  if (actionData.motionData.isFinalized) {
    action = {
      actionType: ActionTypes.MOTION_CLAIM,
      transform: claimPayload,
      onSuccess: handleClaimSuccess,
    };
  }

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
              {items && <DescriptionList items={items} className="mb-6" />}
              {isPolling && <TxButton
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
                />}
              {!isPolling &&
                !actionData.motionData.isFinalized &&
                isFinalizable && (
                  <Button
                    mode="primarySolid"
                    disabled={!user || !isFinalizable}
                    isFullSize
                    text={formatText({ id: 'motion.finalizeStep.submit' })}
                    type="submit"
                  />
                )}
              {!isPolling &&
                actionData.motionData.isFinalized &&
                !isClaimed && (
                  <Button
                    mode="primarySolid"
                    disabled={!user || !canClaimStakes}
                    isFullSize
                    text={formatText({
                      id: buttonTextId,
                    })}
                    type="submit"
                  />
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
