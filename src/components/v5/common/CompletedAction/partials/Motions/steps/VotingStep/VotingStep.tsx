import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { MotionVote } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import FormButtonRadioButtons from '~v5/common/Fields/RadioButtons/ButtonRadioButtons/FormButtonRadioButtons.tsx';
import MotionVoteBadge from '~v5/common/Pills/MotionVoteBadge/index.ts';
import Button from '~v5/shared/Button/index.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import ProgressBar from '~v5/shared/ProgressBar/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';

import { useVotingStep } from './hooks.tsx';
import DescriptionList from './partials/DescriptionList/index.ts';
import { type VotingStepProps, VotingStepSections } from './types.ts';
import { renderVoteRadioButtons } from './utils.tsx';

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
  } = useVotingStep({
    actionData,
    startPollingAction,
    stopPollingAction,
    transactionId,
  });

  const { wallet, user } = useAppContext();
  const isRevealPhase = actionData.motionData.motionStateHistory.inRevealPhase;
  const canVote = !!wallet && !!user && !isRevealPhase;

  const isSupportVote = currentUserVote === MotionVote.Yay;
  const isOpposeVote = currentUserVote === MotionVote.Nay;

  return (
    <MenuWithStatusText
      statusTextSectionProps={{
        status: StatusTypes.Info,
        textClassName: 'text-4 text-gray-900 w-full',
        children: (
          <p className="text-4">
            {formatText(
              { id: 'motion.votingStep.statusText' },
              { thresholdPercent },
            )}
          </p>
        ),
        content: (
          <div className="ml-[1.375rem] mt-1">
            <ProgressBar
              className="mt-2"
              progress={currentReputationPercent}
              threshold={thresholdPercent}
              progressLabel={
                <span className="!text-xs">
                  {formatText(
                    {
                      id: 'motion.votingStep.additionalText',
                    },
                    {
                      progress: currentReputationPercent,
                    },
                  )}
                </span>
              }
              isTall
            />
          </div>
        ),
        iconAlignment: 'top',
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
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-2">
                        {formatText({ id: 'motion.votingStep.voted' })}
                      </h4>
                      <MotionVoteBadge vote={currentUserVote} />
                    </div>
                    {!isRevealPhase && (
                      <div className="mt-4 w-full">
                        <h4 className="mb-1 text-2">
                          {formatText({ id: 'motion.votingStep.changeVote' })}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatText({
                            id: 'motion.votingStep.changeVoteDescription',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {canVote && (
                  <div
                    className={clsx('w-full', {
                      'mt-4': hasUserVoted,
                    })}
                  >
                    {!hasUserVoted && (
                      <h4 className="mb-3 text-center text-1">
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
                )}
              </div>
              <DescriptionList
                items={items}
                className="mt-6 border-t border-gray-200 pt-6"
              />
              {canVote && (
                <Button
                  mode="primarySolid"
                  isFullSize
                  type="submit"
                  className="mt-6"
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
