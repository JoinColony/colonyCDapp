import { BigNumber } from 'ethers';
import React, { FC } from 'react';

import { useGetColonyAction } from '~common/ColonyActions';
import useToggle from '~hooks/useToggle';
import { ActionTypes } from '~redux';
import { ActionForm } from '~shared/Fields';
import { MotionStakes } from '~types';
import { formatText } from '~utils/intl';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem';
import CardWithStatusText from '~v5/shared/CardWithStatusText';
import StatusText from '~v5/shared/StatusText';

import NotEnoughTokensInfo from './partials/NotEnoughTokensInfo';
import StakingForm from './partials/StakingForm';
import { StakingFormValues, StakingStepProps } from './types';
import { useStakingInput } from './useStakingInput';
import { useStakingSlider } from './useStakingSlider';
import useStakingWidgetUpdate from './useStakingWidgetUpdate';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.StakingStep';

const StakingStep: FC<StakingStepProps> = ({
  className,
  action,
  transactionId,
}) => {
  const { motionData } = action || {};
  const { motionId, motionStakes, requiredStake = '' } = motionData || {};

  const [isAccordionOpen, { toggle: toggleAccordion }] = useToggle();

  const { startPollingForAction, stopPollingForAction } = useGetColonyAction();

  const {
    enoughTokensToStakeMinimum,
    opposePercentageStaked,
    supportPercentageStaked,
    isLoadingData,
  } = useStakingSlider(transactionId);

  // @todo: clean up this code after logic for staking will be ready
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isRefetching, setIsRefetching] = useStakingWidgetUpdate(
    motionStakes as unknown as MotionStakes,
    stopPollingForAction,
  );

  const { handleSuccess, transform, validationSchema } = useStakingInput(
    motionId,
    setIsRefetching,
    startPollingForAction,
  );

  const { raw } = motionStakes || {};
  const { yay: yayStakes, nay: nayStakes } = raw || {};

  const isStaked =
    yayStakes && nayStakes && requiredStake
      ? BigNumber.from(yayStakes).gte(requiredStake) &&
        BigNumber.from(nayStakes).isZero()
      : false;

  const showFullySupportedPassInfo =
    supportPercentageStaked === '100%' && opposePercentageStaked !== '100%';
  const showNotEnoughTokensMessage = !enoughTokensToStakeMinimum;

  return isLoadingData ? (
    <div>Loading</div>
  ) : (
    <ActionForm<StakingFormValues>
      defaultValues={{
        amount: '0',
      }}
      validationSchema={validationSchema}
      actionType={ActionTypes.MOTION_STAKE}
      transform={transform}
      onSuccess={handleSuccess}
    >
      <div className={className}>
        <CardWithStatusText
          statusTextSectionProps={{
            textClassName: 'text-4 text-gray-900',
            children: formatText({ id: 'motion.staking.status.text' }),
            iconAlignment: 'top',
            content: showFullySupportedPassInfo ? (
              <StatusText
                status="info"
                className="mt-2"
                iconName="check-circle"
                iconClassName="text-blue-400"
                textClassName="text-4 text-gray-900"
                iconAlignment="top"
              >
                {formatText({ id: 'motion.staking.passIfNotOpposed' })}
              </StatusText>
            ) : undefined,
            status: 'info',
          }}
          sections={[
            ...(showNotEnoughTokensMessage
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
              content: <StakingForm transactionId={transactionId} />,
            },
            ...(!isStaked
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
                        className={`
                          [&_.accordion-toggler]:text-gray-500
                          [&_.accordion-toggler]:text-sm
                          [&_.accordion-toggler_svg]:h-[0.875rem]
                          [&_.accordion-toggler_svg]:w-[0.875rem]
                        `}
                      >
                        content
                      </AccordionItem>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </div>
    </ActionForm>
  );
};

StakingStep.displayName = displayName;

export default StakingStep;
