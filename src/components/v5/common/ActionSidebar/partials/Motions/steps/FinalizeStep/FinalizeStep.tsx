import React, { FC, useEffect, useState } from 'react';
import { ActionTypes } from '~redux';

import { formatText } from '~utils/intl';
import Button, { PendingButton } from '~v5/shared/Button';
import { ActionForm } from '~shared/Fields';
import CardWithStatusText from '~v5/shared/CardWithStatusText';
import DescriptionList from '../VotingStep/partials/DescriptionList';
import { useClaimConfig, useFinalizeStep } from './hooks';
import { FinalizeStepProps } from './types';
// import TeamBadge from '~v5/common/Pills/TeamBadge';
import { useAppContext, useColonyContext } from '~hooks';
import Icon from '~shared/Icon';

import { ActionButton } from '~shared/Button';

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
  const { isFinalizable, transform } = useFinalizeStep(actionData);
  const {
    items,
    isClaimed,
    buttonTextId,
    remainingStakesNumber,
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
    }
    return stopPollingAction;
  }, [isClaimed, stopPollingAction]);

  /* Update colony object when motion gets finalized. */
  useEffect(() => {
    if (actionData.motionData.isFinalized) {
      refetchColony();
    }
  }, [actionData.motionData.isFinalized, refetchColony]);

  return (
    <CardWithStatusText
      statusTextSectionProps={{
        status: 'info',
        children: formatText({ id: 'motion.finalizeStep.statusText' }),
        textClassName: 'text-4',
        iconAlignment: 'top',
        content: (
          <div className="flex items-center text-4 gap-2">
            <span className="flex text-blue-400 mr-2">
              <Icon name="arrows-clockwise" appearance={{ size: 'tiny' }} />
            </span>
            {formatText(
              { id: 'motion.finalizeStep.transactions.remaining' },
              { transactions: remainingStakesNumber },
            )}
          </div>
        ),
      }}
      sections={[
        {
          key: '1',
          content: (
            <ActionForm
              actionType={ActionTypes.MOTION_FINALIZE}
              transform={transform}
              onSuccess={handleSuccess}
            >
              <div className="mb-2">
                <h4 className="text-1 mb-3 flex justify-between items-center">
                  {formatText({ id: 'motion.finalizeStep.title' })}
                  {/* @TODO: use MotionBadge component */}
                  {/* <TeamBadge
                    mode="claimed"
                    teamName={formatText({ id: pillTextId })}
                  /> */}
                  {/* @TODO: implement new logic according to the updated designs */}
                  <ActionButton
                    actionType={ActionTypes.MOTION_CLAIM}
                    values={claimPayload}
                    appearance={{ theme: 'primary', size: 'medium' }}
                    text={{ id: buttonTextId }}
                    disabled={!canClaimStakes}
                    onSuccess={handleClaimSuccess}
                  />
                </h4>
              </div>
              {items && <DescriptionList items={items} className="mb-6" />}
              {isPolling ? (
                <PendingButton className="w-full" rounded="s" />
              ) : (
                <Button
                  mode="primarySolid"
                  disabled={!user || !isFinalizable}
                  isFullSize
                  text={formatText({ id: 'motion.finalizeStep.submit' })}
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
