import React, { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import moveDecimal from 'move-decimal-point';
// import { BigNumber } from 'ethers';

import { accordionAnimation } from '~constants/accordionAnimation';
import FormButtonRadioButtons from '~v5/common/Fields/RadioButtons/ButtonRadioButtons/FormButtonRadioButtons';
import VoteChart from '~v5/shared/VoteChart';
import Numeral from '~shared/Numeral';
import Button from '~v5/shared/Button';
import FormFormattedInput from '~v5/common/Fields/InputBase/FormFormattedInput';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { formatText } from '~utils/intl';

import { STAKING_RADIO_BUTTONS } from '../../../../consts';
import { useStakingSlider } from '../../useStakingSlider';
import { StakingFormProps } from './types';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.StakingStep.partials.StakingForm';

const StakingForm: FC<StakingFormProps> = ({ transactionId }) => {
  const {
    getValues,
    setValue,
    formState: { isSubmitting },
  } = useFormContext();
  const {
    requiredStake,
    nativeTokenDecimals,
    nativeTokenSymbol,
    opposePercentageStaked = '0%',
    supportPercentageStaked = '0%',
    userMaxStake,
  } = useStakingSlider(transactionId);

  const tokenDecimals = getTokenDecimalsWithFallback(nativeTokenDecimals);
  const tokenBalanceInEthers = moveDecimal(userMaxStake, -tokenDecimals);

  // const amountValue = BigNumber.from(
  //   moveDecimal(
  //     getValues('amount'),
  //     getTokenDecimalsWithFallback(nativeTokenDecimals),
  //   ),
  // );
  // const predictedValuePercentage = useMemo(
  //   () =>
  //     amountValue
  //       ? amountValue.div(BigNumber.from(requiredStake)).mul(100).toString()
  //       : '0',
  //   [amountValue, requiredStake],
  // );

  return (
    <div>
      {requiredStake && (
        <h4 className="text-1 text-center text-gray-900 mb-3">
          {formatText(
            {
              id: 'motion.staking.form.title',
            },
            {
              requiredStake: (
                <Numeral
                  value={requiredStake}
                  suffix={nativeTokenSymbol}
                  decimals={nativeTokenDecimals}
                />
              ),
            },
          )}
        </h4>
      )}
      <VoteChart
        againstLabel={
          formatText({ id: 'motion.staking.chart.againstLabel' }) || ''
        }
        forLabel={formatText({ id: 'motion.staking.chart.forLabel' }) || ''}
        percentageVotesAgainst={Number(opposePercentageStaked.slice(0, -1))}
        percentageVotesFor={Number(supportPercentageStaked.slice(0, -1))}
        threshold={10}
        thresholdLabel={
          formatText(
            { id: 'motion.staking.chart.thresholdLabel' },
            {
              value: '10%',
            },
          ) || ''
        }
        className="mb-6"
      />
      <div>
        <FormButtonRadioButtons name="voteType" items={STAKING_RADIO_BUTTONS} />
      </div>
      <AnimatePresence>
        {getValues('voteType') !== undefined && (
          <motion.div
            key="accordion-content"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={accordionAnimation}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mt-6"
          >
            <FormFormattedInput
              name="amount"
              options={{
                numeral: true,
                numeralDecimalScale: tokenDecimals,
                numeralPositiveOnly: true,
                rawValueTrimPrefix: true,
                prefix: nativeTokenSymbol,
                // @todo: fix this - right now prefix is not moved to the end of the text
                tailPrefix: true,
              }}
              buttonProps={{
                label: formatText({ id: 'button.max' }) || '',
                onClick: () => {
                  // @todo: add proper value
                  setValue('amount', tokenBalanceInEthers, {
                    shouldTouch: true,
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                },
              }}
              wrapperClassName="mb-6"
            />
            <Button isFullSize disabled={isSubmitting} type="submit">
              {formatText({ id: 'motion.staking.button.submit' })}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

StakingForm.displayName = displayName;

export default StakingForm;
