import React, { FC } from 'react';
import { defineMessages } from 'react-intl';

import { useAppContext } from '~hooks';
import { ActionTypes } from '~redux';
import { ActionForm } from '~shared/Fields';
import { MotionVote } from '~utils/colonyMotions';
import { formatText } from '~utils/intl';
import FormButtonRadioButtons from '~v5/common/Fields/RadioButtons/ButtonRadioButtons/FormButtonRadioButtons';
import Button from '~v5/shared/Button';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText';
import ProgressBar from '~v5/shared/ProgressBar';

import MotionBadge from '../../partials/MotionBadge/MotionBadge';

import { useVotingStep } from './hooks';
import DescriptionList from './partials/DescriptionList';
import { VotingStepProps, VotingStepSections } from './types';
import { renderVoteRadioButtons } from './utils';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.VotingStep';

const MSG = defineMessages({
  changeVote: {
    id: `${displayName}.changeVote`,
    defaultMessage: 'Change Vote',
  },
  submitVote: {
    id: `${displayName}.submitVote`,
    defaultMessage: 'Submit vote',
  },
});

const VotingStep: FC<VotingStepProps> = ({
  actionData,
  startPollingAction,
  stopPollingAction,
  transactionId,
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
  } = useVotingStep(
    actionData,
    startPollingAction,
    stopPollingAction,
    transactionId,
  );

  const { wallet, user } = useAppContext();
  const canVote =
    !!wallet &&
    !!user &&
    !actionData.motionData.motionStateHistory.inRevealPhase;

  const isSupportVote = currentUserVote === MotionVote.Yay;
  const isOpposeVote = currentUserVote === MotionVote.Nay;

  return (
    <MenuWithStatusText
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
            isTall
          />
        ),
      }}
      sections={[
        {
          key: VotingStepSections.Vote,
          content: (
            <ActionForm
              actionType={ActionTypes.MOTION_VOTE}
              transform={transform}
              onSuccess={handleSuccess}
              validationSchema={validationSchema}
              defaultValues={{ vote: undefined }}
            >
              <div>
                {hasUserVoted && (isSupportVote || isOpposeVote) && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between gap-2 mb-6">
                      <h4 className="text-2">
                        {formatText({ id: 'motion.votingStep.voted' })}
                      </h4>
                      <MotionBadge
                        status={isSupportVote ? 'support' : 'oppose'}
                      />
                    </div>
                    {!actionData.motionData.motionStateHistory
                      .inRevealPhase && (
                      <>
                        <h4 className="text-2 mb-1">
                          {formatText({ id: 'motion.votingStep.changeVote' })}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatText({
                            id: 'motion.votingStep.changeVoteDescription',
                          })}
                        </p>
                      </>
                    )}
                  </div>
                )}
                {canVote && (
                  <>
                    {!hasUserVoted && (
                      <h4 className="text-1 mb-3 text-center">
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
                  </>
                )}
              </div>
              {(hasUserVoted || canVote) && (
                <div className="mt-7 pt-6 border-t border-gray-200" />
              )}
              <DescriptionList items={items} className="my-1" />
              {canVote && (
                <Button
                  mode="primarySolid"
                  isFullSize
                  type="submit"
                  className="mt-8"
                  text={formatText(
                    hasUserVoted ? MSG.changeVote : MSG.submitVote,
                  )}
                />
              )}
            </ActionForm>
          ),
        },
      ]}
    />
  );
};

VotingStep.displayName = displayName;

export default VotingStep;
