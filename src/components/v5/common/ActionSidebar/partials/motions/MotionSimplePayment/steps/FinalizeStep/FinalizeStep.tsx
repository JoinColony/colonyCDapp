import React, { FC, useEffect, useState } from 'react';
import { ActionTypes } from '~redux';

import { formatText } from '~utils/intl';
import Button, { PendingButton } from '~v5/shared/Button';
import { ActionForm } from '~shared/Fields';
import CardWithStatusText from '~v5/shared/CardWithStatusText';
import DescriptionList from '../VotingStep/partials/DescriptionList';
import { useFinalizeStep } from './hooks';
import { FinalizeStepProps } from './types';
import TeamBadge from '~v5/common/Pills/TeamBadge';
import { useAppContext } from '~hooks';
import Icon from '~shared/Icon';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.FinalizeStep';

const FinalizeStep: FC<FinalizeStepProps> = ({
  actionData,
  startPollingAction,
  stopPollingAction,
}) => {
  const { user } = useAppContext();
  const [isPolling, setIsPolling] = useState(false);
  const { items, isFinalizable, transform } = useFinalizeStep(actionData);

  const handleSuccess = () => {
    startPollingAction(1000);
    setIsPolling(true);
  };

  /* Stop polling when mounted / dismounted */
  useEffect(() => {
    stopPollingAction();
    return stopPollingAction;
  }, [stopPollingAction]);

  return (
    <CardWithStatusText
      statusTextSectionProps={{
        status: 'info',
        children: formatText({ id: 'motion.finalizeStep.statusText' }),
        textClassName: 'text-4',
        iconAlignment: 'top',
        content: (
          <span className="flex items-center text-4 mt-2">
            {/* @TODO add logic with transactions */}
            <span className="flex text-blue-400 mr-2">
              <Icon name="arrows-clockwise" appearance={{ size: 'tiny' }} />
            </span>
            {formatText(
              { id: 'motion.finalizeStep.transactions.remaining' },
              { transactions: 3 },
            )}
          </span>
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
                  <TeamBadge mode="claimed" teamName="Claimed" />
                  {/* @TODO add logic to show / hide the pill */}
                </h4>
              </div>
              <DescriptionList items={items} className="mb-6" />
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
