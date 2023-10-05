import React, { FC } from 'react';
import clsx from 'clsx';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button';

import CardWithStatusText from '~v5/shared/CardWithStatusText';
import ProgressBar from '~v5/shared/ProgressBar';
import FormButtonRadioButtons from '~v5/common/Fields/RadioButtons/ButtonRadioButtons/FormButtonRadioButtons';
import { ActionForm } from '~shared/Fields';
import { ActionTypes } from '~redux';
import DescriptionList from './partials/DescriptionList';
import { VotingStepProps } from './types';
import { MotionVote } from '~utils/colonyMotions';
import { renderVoteRadioButtons } from './utils';
import { useVotingStep } from './hooks';
import PillsBase from '~v5/common/Pills/PillsBase';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.VotingStep';

const VotingStep: FC<VotingStepProps> = ({
  actionData,
  startPollingAction,
  stopPollingAction,
}) => {
  const {
    currentReputationPercent,
    currentUserVote,
    handleSuccess,
    hasUserVoted,
    items,
    thresholdPercent,
    validationSchema,
    transform,
  } = useVotingStep(actionData, startPollingAction, stopPollingAction);

  const isSupportVote = currentUserVote === MotionVote.Yay;

  return (
    <CardWithStatusText
      statusTextSectionProps={{
        status: 'info',
        children: formatText(
          { id: 'motion.votingStep.statusText' },
          { thresholdPercent },
        ),
        textClassName: 'text-4',
        iconAlignment: 'top',
        content: (
          <ProgressBar
            progress={currentReputationPercent}
            threshold={thresholdPercent}
            additionalText={formatText({
              id: 'motion.votingStep.additionalText',
            })}
          />
        ),
      }}
      sections={[
        {
          key: '1',
          content: (
            <ActionForm
              actionType={ActionTypes.MOTION_VOTE}
              transform={transform}
              onSuccess={handleSuccess}
              validationSchema={validationSchema}
              defaultValues={{ vote: undefined }}
            >
              <div className="mb-6 pb-6 border-b border-gray-200">
                {hasUserVoted ? (
                  <div className="mb-3">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <h4 className="text-2">You voted:</h4>
                      <PillsBase
                        className={clsx({
                          'bg-purple-100 text-purple-400': isSupportVote,
                          'bg-negative-100 text-negative-400': !isSupportVote,
                        })}
                        iconName={isSupportVote ? 'thumbs-up' : 'thumbs-down'}
                      >
                        {isSupportVote ? 'support' : 'oppose'}
                      </PillsBase>
                    </div>
                    <h4 className="text-2 mb-1">Change your vote:</h4>
                    <p className="text-sm text-gray-600">
                      You can change your vote while still in voting phase.
                    </p>
                  </div>
                ) : (
                  <h4 className="text-2 mb-3 text-center">
                    {formatText({ id: 'motion.votingStep.title' })}
                  </h4>
                )}
                <FormButtonRadioButtons
                  items={renderVoteRadioButtons(
                    hasUserVoted,
                    currentUserVote || 0,
                  )}
                  name="vote"
                />
              </div>
              <DescriptionList items={items} className="mb-6" />
              <Button
                mode="primarySolid"
                isFullSize
                type="submit"
                text={formatText({ id: 'motion.votingStep.submit' })}
              />
            </ActionForm>
          ),
        },
      ]}
    />
  );
};

VotingStep.displayName = displayName;

export default VotingStep;
