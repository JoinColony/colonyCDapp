import React, { FC, useState } from 'react';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { RevealStepProps } from './types';
import CardWithStatusText from '~v5/shared/CardWithStatusText';
import ProgressBar from '~v5/shared/ProgressBar';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button';
import { ActionForm } from '~shared/Fields';
import { ActionTypes } from '~redux';
import StatusText from '~v5/shared/StatusText';
import Numeral from '~shared/Numeral';
import RevealInformationList from './partials/RevealInformationList';
import { useRevealStep } from './hooks';
import MotionBadge from '../../partials/MotionBadge/MotionBadge';
import { accordionAnimation } from '~constants/accordionAnimation';
import Icon from '~shared/Icon';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.RevealStep';

const RevealStep: FC<RevealStepProps> = ({
  motionData,
  startPollingAction,
  stopPollingAction,
  transactionId,
}) => {
  const [isInformationOpen, setIsInformationOpen] = useState(false);
  const {
    handleSuccess,
    nativeToken,
    transform,
    userVoteRevealed,
    voterReward,
    voters,
    isSupportVote,
    revealProgress,
    totalVoters,
  } = useRevealStep(
    motionData,
    startPollingAction,
    stopPollingAction,
    transactionId,
  );

  return (
    <CardWithStatusText
      statusTextSectionProps={{
        status: 'info',
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
            />
            <StatusText
              status="warning"
              textClassName="text-4 text-gray-900"
              iconAlignment="top"
            >
              {formatText({ id: 'motion.revealStep.warning' })}
            </StatusText>
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
              <div className={clsx({ 'mb-6': !userVoteRevealed })}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-2">
                    {formatText({ id: 'motion.revealStep.title' })}
                  </h4>
                  <MotionBadge status={isSupportVote ? 'support' : 'oppose'} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-600">
                    {formatText({ id: 'motion.revealStep.rewards' })}
                  </span>
                  <span className="text-sm">
                    <Numeral
                      value={voterReward || '0'}
                      decimals={nativeToken?.decimals}
                      suffix={nativeToken?.symbol}
                    />
                  </span>
                </div>
              </div>
              {!userVoteRevealed && (
                <Button
                  mode="primarySolid"
                  type="submit"
                  isFullSize
                  text={formatText({ id: 'motion.revealStep.submit' })}
                />
              )}
            </ActionForm>
          ),
        },
      ]}
      footer={
        <>
          <button
            type="button"
            className="text-sm text-gray-600 flex items-center justify-between gap-2 w-full md:hover:text-blue-400"
            onClick={() => setIsInformationOpen((prevState) => !prevState)}
          >
            <span className="transition-colors">
              {formatText({
                id: isInformationOpen
                  ? 'motion.revealStep.buttonHide'
                  : 'motion.revealStep.buttonShow',
              })}
            </span>
            <Icon
              name="caret-up"
              className={clsx(
                'w-[0.875rem] h-[0.875rem] flex-shrink-0 transition-all',
                {
                  'rotate-180': isInformationOpen,
                  'rotate-0': !isInformationOpen,
                },
              )}
            />
          </button>
          <motion.div
            initial="hidden"
            animate={isInformationOpen ? 'visible' : 'hidden'}
            variants={accordionAnimation}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <RevealInformationList items={voters} />
          </motion.div>
        </>
      }
    />
  );
};

RevealStep.displayName = displayName;

export default RevealStep;
