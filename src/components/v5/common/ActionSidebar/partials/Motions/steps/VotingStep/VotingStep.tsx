import { ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { MotionVote } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import FormButtonRadioButtons from '~v5/common/Fields/RadioButtons/ButtonRadioButtons/FormButtonRadioButtons.tsx';
import MotionVoteBadge from '~v5/common/Pills/MotionVoteBadge/index.ts';
import Button, { ActionButton } from '~v5/shared/Button/index.ts';
import { LoadingBehavior } from '~v5/shared/Button/types.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import ProgressBar from '~v5/shared/ProgressBar/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';
import StatusText from '~v5/shared/StatusText/StatusText.tsx';

import { useVotingStep } from './hooks.tsx';
import DescriptionList from './partials/DescriptionList/index.ts';
import {
  type VotingStepProps,
  VotingStepSections,
  type VotingFormValues,
} from './types.ts';

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
  isActionCancelled,
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
    handleChangeVoteSuccess,
    getChangeVotePayload,
  } = useVotingStep({
    actionData,
    startPollingAction,
    stopPollingAction,
    transactionId,
  });

  const { isDarkMode } = usePageThemeContext();

  const { wallet, user } = useAppContext();
  const isRevealPhase = actionData.motionData.motionStateHistory.inRevealPhase;
  const canVote = !!wallet && !!user && !isRevealPhase;

  const isSupportVote = currentUserVote === MotionVote.Yay;
  const isOpposeVote = currentUserVote === MotionVote.Nay;

  return (
    <MenuWithStatusText
      statusText={
        <StatusText
          status={StatusTypes.Info}
          textClassName="text-4 text-gray-900 w-full"
          iconAlignment="top"
        >
          <p className="text-4">
            {formatText(
              { id: 'motion.votingStep.statusText' },
              { thresholdPercent },
            )}
          </p>
        </StatusText>
      }
      content={
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
      }
      sections={[
        ...(isActionCancelled
          ? [
              {
                key: '1',
                content: (
                  <p className="text-sm">
                    {formatText({ id: 'motion.cancelled' })}
                  </p>
                ),
                className: 'bg-negative-100 text-negative-400 !py-3',
              },
            ]
          : []),
        {
          key: VotingStepSections.Vote,
          content: (
            <>
              <ActionForm<VotingFormValues>
                actionType={ActionTypes.MOTION_VOTE}
                transform={transform}
                onSuccess={handleSuccess}
                validationSchema={validationSchema}
                defaultValues={{ vote: undefined }}
              >
                {({ formState: { isSubmitting } }) => (
                  <>
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
                                {formatText({
                                  id: 'motion.votingStep.changeVote',
                                })}
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
                      {canVote && !hasUserVoted && (
                        <div
                          className={clsx('w-full', {
                            'mt-4': hasUserVoted,
                          })}
                        >
                          <h4 className="mb-3 text-center text-1">
                            {formatText({ id: 'motion.votingStep.title' })}
                          </h4>
                          <FormButtonRadioButtons
                            disabled={isSubmitting}
                            items={[
                              {
                                label: formatText({ id: 'motion.oppose' }),
                                id: 'oppose',
                                value: MotionVote.Nay,
                                className: (checked, disabled) =>
                                  clsx({
                                    'border-negative-300 text-gray-900 [&_.icon]:text-negative-400':
                                      !checked && !disabled,
                                    'border-gray-300 text-gray-300 [&_.icon]:text-gray-300':
                                      disabled,
                                    'border-negative-400 bg-negative-400 text-base-white':
                                      checked && !disabled && !isDarkMode,
                                    'border-negative-400 bg-negative-400 text-gray-900':
                                      checked && !disabled && isDarkMode,
                                  }),
                                icon: ThumbsDown,
                                disabled: isSubmitting,
                              },
                              {
                                label: formatText({ id: 'motion.support' }),
                                id: 'support',
                                value: MotionVote.Yay,
                                className: (checked, disabled) =>
                                  clsx({
                                    'border-purple-200 text-gray-900 [&_.icon]:text-purple-400':
                                      !checked && !disabled,
                                    'border-gray-300 text-gray-300 [&_.icon]:text-gray-300':
                                      disabled,
                                    'border-purple-400 bg-purple-400 text-base-white':
                                      checked && !disabled && !isDarkMode,
                                    'border-purple-400 bg-purple-400 text-gray-900':
                                      checked && !disabled && isDarkMode,
                                  }),
                                icon: ThumbsUp,
                                disabled: isSubmitting,
                              },
                            ]}
                            name="vote"
                          />
                        </div>
                      )}
                    </div>
                    <DescriptionList
                      items={items}
                      className="mt-6 border-t border-gray-200 pt-6"
                    />
                    {canVote && !hasUserVoted && (
                      <Button
                        disabled={isSubmitting}
                        mode="primarySolid"
                        isFullSize
                        type="submit"
                        className="mt-6"
                        text={formatText(MSG.submitVote)}
                      />
                    )}
                  </>
                )}
              </ActionForm>
              {canVote && hasUserVoted && (
                <div className="mt-6">
                  <ActionButton
                    actionType={ActionTypes.MOTION_VOTE}
                    loadingBehavior={LoadingBehavior.Disabled}
                    isFullSize
                    values={getChangeVotePayload}
                    onSuccess={handleChangeVoteSuccess}
                  >
                    {formatText(MSG.changeVote)}
                  </ActionButton>
                </div>
              )}
            </>
          ),
        },
      ]}
    />
  );
};

VotingStep.displayName = displayName;

export default VotingStep;
