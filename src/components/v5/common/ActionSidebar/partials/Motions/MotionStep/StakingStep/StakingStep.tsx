import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { formatRelative } from 'date-fns';
import React, { type FC } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { SystemMessages } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import { useMotionContext } from '~v5/common/ActionSidebar/partials/Motions/partials/MotionProvider/hooks.ts';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem/index.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';
import StatusText from '~v5/shared/StatusText/StatusText.tsx';

import { useStakingStep } from './hooks.tsx';
import NotEnoughTokensInfo from './partials/NotEnoughTokensInfo/index.ts';
import StakesList from './partials/StakesList/index.ts';
import StakingChart from './partials/StakingChart/index.ts';
import StakingForm from './partials/StakingForm/index.ts';
import { type StakingStepProps } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.StakingStep';

const StakingStep: FC<StakingStepProps> = ({ className, isActive }) => {
  const { canInteract } = useAppContext();
  const { action, motionData } = useMotionContext();
  const [isAccordionOpen, { toggle: toggleAccordion }] = useToggle();
  const {
    enoughReputationToStakeMinimum,
    enoughTokensToStakeMinimum,
    isLoading,
    userActivatedTokens,
    userInactivatedTokens,
  } = useStakingStep();
  const { colony, token } = action;
  const {
    usersStakes,
    motionStakes,
    requiredStake,
    motionDomain: { metadata },
    isFinalized,
  } = motionData;

  const { nativeToken } = colony;
  const { nativeTokenDecimals, nativeTokenSymbol } = nativeToken;
  const { decimals, symbol } = token || {};

  const { percentage } = motionStakes;
  const { nay, yay } = percentage;

  const objectingStakesPercentageValue = Number(nay) || 0;
  const supportingStakesPercentageValue = Number(yay) || 0;

  const isStaked = !!usersStakes?.length;
  const isFullyStaked =
    objectingStakesPercentageValue === 100 &&
    supportingStakesPercentageValue === 100;

  const votingPhaseStartedMessage = motionData.messages?.items.find(
    (message) => message?.name === SystemMessages.MotionVotingPhase,
  );

  const teamName = metadata?.name;

  const cardTitleMessageId = (() => {
    if (isFullyStaked) {
      return 'motion.staking.status.text.locked';
    }
    if (objectingStakesPercentageValue === 100) {
      return 'motion.staking.status.text.opposed';
    }
    if (supportingStakesPercentageValue === 100) {
      return 'motion.staking.status.text.supported';
    }

    return 'motion.staking.status.text';
  })();

  const canUserStake = canInteract && !isFinalized;
  const shouldShowNotEnoughReputation =
    !enoughReputationToStakeMinimum && canUserStake;
  const shouldShowNotEnoughTokens =
    !enoughTokensToStakeMinimum &&
    enoughReputationToStakeMinimum &&
    canUserStake;

  return isLoading ? (
    <SpinnerLoader />
  ) : (
    <div className={className}>
      <MenuWithStatusText
        statusText={
          <StatusText
            status={
              (objectingStakesPercentageValue === 100 ||
                supportingStakesPercentageValue === 100) &&
              !isFullyStaked
                ? StatusTypes.Warning
                : StatusTypes.Info
            }
            iconSize={16}
            iconAlignment="top"
            textClassName="text-4 text-gray-900"
          >
            {formatText(
              {
                id: cardTitleMessageId,
              },
              {
                time: formatRelative(
                  new Date(votingPhaseStartedMessage?.createdAt || new Date()),
                  new Date(),
                ),
              },
            )}
          </StatusText>
        }
        sections={[
          ...(shouldShowNotEnoughReputation
            ? [
                {
                  key: '1',
                  content: (
                    <p className="text-sm">
                      {formatText(
                        {
                          id: 'motion.staking.notEnoughReputation',
                        },
                        { teamName },
                      )}
                    </p>
                  ),
                  className: 'bg-negative-100 text-negative-400 !py-3',
                },
              ]
            : []),
          ...(shouldShowNotEnoughTokens
            ? [
                {
                  key: '2',
                  content: <NotEnoughTokensInfo />,
                  className: 'bg-negative-100 text-negative-400 !py-3',
                },
              ]
            : []),
          {
            key: '2',
            content: (
              <div className={clsx({ 'mb-1.5': isStaked })}>
                {isFullyStaked || !isActive ? (
                  <StakingChart
                    chartProps={{
                      percentageVotesAgainst: objectingStakesPercentageValue,
                      percentageVotesFor: supportingStakesPercentageValue,
                    }}
                    tokenDecimals={decimals || nativeTokenDecimals}
                    tokenSymbol={symbol || nativeTokenSymbol}
                    requiredStake={requiredStake}
                  />
                ) : (
                  <StakingForm
                    disableForm={
                      !enoughReputationToStakeMinimum ||
                      !enoughTokensToStakeMinimum
                    }
                    userActivatedTokens={userActivatedTokens}
                    userInactivatedTokens={userInactivatedTokens}
                  />
                )}
              </div>
            ),
          },
          ...(isStaked
            ? [
                {
                  key: '4',
                  content: (
                    <AccordionItem
                      title={formatText({
                        id: isAccordionOpen
                          ? 'motion.staking.accordion.title.hide'
                          : 'motion.staking.accordion.title.show',
                      })}
                      isOpen={isAccordionOpen}
                      onToggle={toggleAccordion}
                      className={clsx(
                        `
                          [&_.accordion-toggler]:text-sm
                          [&_.accordion-toggler]:text-gray-500
                        `,
                        {
                          '[&_.accordion-toggler]:text-blue-500':
                            isAccordionOpen,
                        },
                      )}
                      icon={CaretDown}
                      iconSize={16}
                    >
                      <StakesList userStakes={usersStakes} />
                    </AccordionItem>
                  ),
                },
              ]
            : []),
        ]}
      />
    </div>
  );
};

StakingStep.displayName = displayName;

export default StakingStep;
