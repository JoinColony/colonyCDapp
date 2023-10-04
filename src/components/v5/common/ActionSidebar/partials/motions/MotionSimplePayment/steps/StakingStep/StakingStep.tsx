import React, { FC } from 'react';
import { object, string } from 'yup';

import { useGetColonyAction } from '~common/ColonyActions';
import { ActionTypes } from '~redux';
import { ActionForm } from '~shared/Fields';
import { MotionStakes } from '~types';
import { formatText } from '~utils/intl';
import CardWithStatusText from '~v5/shared/CardWithStatusText';
import StatusText from '~v5/shared/StatusText';

import NotEnoughTokensInfo from './partials/NotEnoughTokensInfo';
import StakingForm from './partials/StakingForm';
import { StakingStepProps } from './types';
import { useStakingInput } from './useStakingInput';
import useStakingWidgetUpdate from './useStakingWidgetUpdate';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.StakingStep';

const validationSchema = object({
  amount: string().defined(),
}).defined();

const StakingStep: FC<StakingStepProps> = ({
  className,
  action,
  transactionId,
}) => {
  const { motionData } = action || {};
  const { motionId, motionStakes, remainingStakes, userMinStake } =
    motionData || {};
  const isObjection = false;
  const [nayRemaining, yayRemaining] = remainingStakes || [];
  const remainingToStake = isObjection ? nayRemaining : yayRemaining;
  const { startPollingForAction, stopPollingForAction } = useGetColonyAction();

  // @todo: clean up this code after logic for staking will be ready
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isRefetching, setIsRefetching] = useStakingWidgetUpdate(
    motionStakes as unknown as MotionStakes,
    stopPollingForAction,
  );

  const { handleSuccess, transform } = useStakingInput(
    isObjection,
    motionId,
    remainingToStake,
    userMinStake,
    setIsRefetching,
    startPollingForAction,
  );

  // @todo: show after stake submit, when 100% supported
  const showFullySupportedPassInfo = true;
  // @todo: show when a user doesn't have enough tokens activated to stake
  const showNotEnoughTokensMessage = true;

  return (
    <ActionForm<{
      amount: string;
    }>
      defaultValues={{
        amount: '0',
      }}
      validationSchema={validationSchema}
      actionType={ActionTypes.MOTION_STAKE}
      transform={transform}
      onSuccess={handleSuccess}
    >
      {({ formState: { isSubmitSuccessful } }) => (
        <div className={className}>
          <CardWithStatusText
            statusTextSectionProps={{
              textClassName: 'text-4 text-gray-900',
              children: formatText({ id: 'motion.staking.status.text' }),
              content: showFullySupportedPassInfo ? (
                <StatusText
                  status="info"
                  className="mt-2"
                  iconName="check-circle"
                  iconClassName="text-blue-400"
                  textClassName="text-4 text-gray-900"
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
              ...(isSubmitSuccessful
                ? [
                    {
                      key: '3',
                      content: 'accordion',
                    },
                  ]
                : []),
            ]}
          />
        </div>
      )}
    </ActionForm>
  );
};

StakingStep.displayName = displayName;

export default StakingStep;
