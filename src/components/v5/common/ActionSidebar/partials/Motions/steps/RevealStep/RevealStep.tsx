import { MotionState as NetworkMotionState } from '@colony/colony-js';
import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { useAppContext } from '~context/AppContext.tsx';
import useToggle from '~hooks/useToggle/index.ts';
import { ActionTypes } from '~redux/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import MotionVoteBadge from '~v5/common/Pills/MotionVoteBadge/index.ts';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem/index.ts';
import Button from '~v5/shared/Button/index.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import ProgressBar from '~v5/shared/ProgressBar/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';
import StatusText from '~v5/shared/StatusText/index.ts';

import { useRevealStep } from './hooks.ts';
import RevealInformationList from './partials/RevealInformationList.tsx';
import { type RevealStepProps } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.RevealStep';

const RevealStep: FC<RevealStepProps> = ({
  motionData,
  motionState,
  startPollingAction,
  stopPollingAction,
  transactionId,
}) => {
  const { canInteract } = useAppContext();
  const [isInformationAccordionOpen, { toggle: toggleInformationAccordion }] =
    useToggle();
  const {
    hasUserVoted,
    handleSuccess,
    nativeToken,
    transform,
    userVoteRevealed,
    voterReward,
    voters,
    userVote,
    revealProgress,
    totalVoters,
  } = useRevealStep(
    motionData,
    startPollingAction,
    stopPollingAction,
    transactionId,
  );

  const { decimals, symbol } = nativeToken || {};

  const motionFinished =
    motionState === NetworkMotionState.Finalizable ||
    motionState === NetworkMotionState.Finalized ||
    motionState === NetworkMotionState.Failed;

  const revealPhaseEnded = hasUserVoted && userVoteRevealed && motionFinished;

  return (
    <MenuWithStatusText
      statusTextSectionProps={{
        status: StatusTypes.Info,
        children: formatText({ id: 'motion.revealStep.statusText' }),
        textClassName: 'text-4',
        content: (
          <div className="mt-1 flex flex-col gap-2">
            <ProgressBar
              progress={revealProgress}
              max={totalVoters}
              additionalText={formatText({
                id:
                  revealProgress === 1
                    ? 'motion.revealStep.voteRevealed'
                    : 'motion.revealStep.votesRevealed',
              })}
              className="ml-1"
              isTall
            />
            {!revealPhaseEnded && canInteract && (
              <StatusText
                status={StatusTypes.Warning}
                textClassName="text-4 text-gray-900"
                iconAlignment="top"
              >
                {formatText({ id: 'motion.revealStep.warning' })}
              </StatusText>
            )}
          </div>
        ),
      }}
      sections={[
        {
          key: '1',
          content: (
            <ActionForm
              actionType={ActionTypes.MOTION_REVEAL_VOTE}
              transform={transform}
              onSuccess={handleSuccess}
            >
              {hasUserVoted ? (
                <>
                  <div className={clsx({ 'mb-6': !userVoteRevealed })}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="text-2">
                        {formatText({ id: 'motion.revealStep.title' })}
                      </h4>
                      <MotionVoteBadge vote={userVote} />
                    </div>
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <p className="text-gray-600">
                        {formatText({ id: 'motion.revealStep.rewards' })}
                      </p>
                      <Numeral
                        value={voterReward || '0'}
                        decimals={decimals}
                        suffix={symbol}
                      />
                    </div>
                  </div>
                  {!motionFinished && !userVoteRevealed && (
                    <Button
                      mode="primarySolid"
                      type="submit"
                      isFullSize
                      text={formatText({ id: 'motion.revealStep.submit' })}
                    />
                  )}
                </>
              ) : (
                <>
                  <h4 className="text-1 mb-2">
                    {formatText({ id: 'motion.revealStep.emptyTitle' })}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {formatText({ id: 'motion.revealStep.emptyDescription' })}
                  </p>
                </>
              )}
            </ActionForm>
          ),
        },
      ]}
      footer={
        <AccordionItem
          className="text-sm text-gray-500"
          isOpen={isInformationAccordionOpen}
          onToggle={toggleInformationAccordion}
          title={formatText({
            id: isInformationAccordionOpen
              ? 'motion.revealStep.buttonHide'
              : 'motion.revealStep.buttonShow',
          })}
          icon={CaretDown}
          iconSize={16}
        >
          <RevealInformationList items={voters} />
        </AccordionItem>
      }
    />
  );
};

RevealStep.displayName = displayName;

export default RevealStep;
