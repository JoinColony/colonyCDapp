import { MotionState as NetworkMotionState } from '@colony/colony-js';
import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { ActionTypes } from '~redux/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { MotionVote } from '~utils/colonyMotions.ts';
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
  rootHash,
  isActionCancelled,
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
  } = useRevealStep({
    motionData,
    startPollingAction,
    stopPollingAction,
    transactionId,
    rootHash,
  });

  const { decimals, symbol } = nativeToken || {};

  const motionFinished =
    motionState === NetworkMotionState.Finalizable ||
    motionState === NetworkMotionState.Finalized ||
    motionState === NetworkMotionState.Failed;

  const revealPhaseEnded = hasUserVoted && userVoteRevealed && motionFinished;

  return (
    <MenuWithStatusText
      statusText={
        <StatusText
          status={StatusTypes.Info}
          iconAlignment="top"
          textClassName="w-full"
        >
          <p className="text-gray-900 text-4">
            {formatText({ id: 'motion.revealStep.statusText' })}
          </p>
        </StatusText>
      }
      content={
        <>
          <div className="ml-[1.375rem] mt-1">
            <ProgressBar
              className="mt-2"
              progress={revealProgress}
              progressLabel={
                <span className="!text-xs">
                  {formatText(
                    {
                      id: 'motion.revealStep.votesRevealed',
                    },
                    {
                      votes: revealProgress,
                    },
                  )}
                </span>
              }
              max={totalVoters}
              isTall
            />
          </div>
          {!revealPhaseEnded && canInteract && (
            <StatusText
              status={StatusTypes.Warning}
              textClassName="text-4 text-gray-900"
              iconAlignment="top"
            >
              {formatText({ id: 'motion.revealStep.warning' })}
            </StatusText>
          )}
        </>
      }
      sections={[
        ...(isActionCancelled
          ? [
              {
                key: '3',
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
          key: '1',
          content: (
            <ActionForm
              actionType={ActionTypes.MOTION_REVEAL_VOTE}
              transform={transform}
              onSuccess={handleSuccess}
            >
              {hasUserVoted &&
              (userVote === MotionVote.Nay || userVote === MotionVote.Yay) ? (
                <div className="mb-1.5">
                  <div className={clsx({ 'mb-6': !userVoteRevealed })}>
                    <div className="mb-2 flex items-center justify-between gap-2">
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
                        suffix={` ${symbol}`}
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
                </div>
              ) : (
                <>
                  <h4 className="mb-2 text-1">
                    {formatText({ id: 'motion.revealStep.emptyTitle' })}
                  </h4>
                  <p className="mb-1.5 text-sm text-gray-600">
                    {formatText({ id: 'motion.revealStep.emptyDescription' })}
                  </p>
                </>
              )}
            </ActionForm>
          ),
        },
        {
          key: '2',
          content: (
            <AccordionItem
              title={formatText({
                id: isInformationAccordionOpen
                  ? 'motion.revealStep.buttonHide'
                  : 'motion.revealStep.buttonShow',
              })}
              isOpen={isInformationAccordionOpen}
              onToggle={() => toggleInformationAccordion()}
              className={clsx(
                `
                  [&_.accordion-toggler]:text-sm
                  [&_.accordion-toggler]:text-gray-500
                `,
                {
                  '[&_.accordion-toggler]:text-blue-500':
                    isInformationAccordionOpen,
                },
              )}
              icon={CaretDown}
              iconSize={16}
            >
              <RevealInformationList items={voters} />
            </AccordionItem>
          ),
        },
      ]}
    />
  );
};

RevealStep.displayName = displayName;

export default RevealStep;
