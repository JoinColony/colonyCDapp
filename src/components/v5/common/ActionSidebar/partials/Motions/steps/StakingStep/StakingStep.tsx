import clsx from 'clsx';
import { formatRelative } from 'date-fns';
import React, { type FC } from 'react';

import { useAppContext } from '~context/AppContext.tsx';
import useToggle from '~hooks/useToggle/index.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { SystemMessages } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem/index.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import StatusText from '~v5/shared/StatusText/index.ts';

import { useMotionContext } from '../../partials/MotionProvider/hooks.ts';

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
  const { motionAction } = useMotionContext();
  const [isAccordionOpen, { toggle: toggleAccordion }] = useToggle();
  const {
    enoughReputationToStakeMinimum,
    enoughTokensToStakeMinimum,
    isLoading,
    userActivatedTokens,
    userInactivatedTokens,
  } = useStakingStep();
  const { motionData, colony, token } = motionAction;
  const { usersStakes, motionStakes, requiredStake } = motionData;

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

  const showFullySupportedPassInfo =
    objectingStakesPercentageValue !== 100 &&
    supportingStakesPercentageValue === 100;

  const votingPhaseStartedMessage = motionData.messages?.items.find(
    (message) => message?.name === SystemMessages.MotionVotingPhase,
  );

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

  return isLoading ? (
    <SpinnerLoader />
  ) : (
    <div className={className}>
      <MenuWithStatusText
        statusTextSectionProps={{
          textClassName: 'text-4 text-gray-900',
          children: formatText(
            {
              id: cardTitleMessageId,
            },
            {
              time: formatRelative(
                new Date(votingPhaseStartedMessage?.createdAt || new Date()),
                new Date(),
              ),
            },
          ),
          iconAlignment: 'top',
          iconSize: 'extraSmall',
          content: showFullySupportedPassInfo ? (
            <StatusText
              status="info"
              className="mt-2"
              iconName="check-circle"
              iconClassName="text-blue-400"
              textClassName="text-4 text-gray-900"
              iconAlignment="top"
              iconSize="extraSmall"
            >
              {formatText({ id: 'motion.staking.passIfNotOpposed' })}
            </StatusText>
          ) : undefined,
          status:
            objectingStakesPercentageValue === 100 ||
            supportingStakesPercentageValue === 100
              ? 'warning'
              : 'info',
        }}
        sections={[
          ...(!enoughReputationToStakeMinimum && canInteract
            ? [
                {
                  key: '1',
                  content: (
                    <p className="text-sm">
                      {formatText({
                        id: 'motion.staking.notEnoughReputation',
                      })}
                    </p>
                  ),
                  className: 'bg-negative-100 text-negative-400',
                },
              ]
            : []),
          ...(!enoughTokensToStakeMinimum &&
          enoughReputationToStakeMinimum &&
          canInteract
            ? [
                {
                  key: '1',
                  content: <NotEnoughTokensInfo />,
                  className: 'bg-negative-100 text-negative-400',
                },
              ]
            : []),
          {
            key: '2',
            content:
              isFullyStaked || !isActive ? (
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
              ),
          },
          ...(isStaked
            ? [
                {
                  key: '3',
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
                          [&_.accordion-toggler]:text-gray-500
                          [&_.accordion-toggler]:text-sm
                        `,
                        {
                          '[&_.accordion-toggler]:text-blue-500':
                            isAccordionOpen,
                        },
                      )}
                      iconName="caret-down"
                      iconSize="extraSmall"
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
