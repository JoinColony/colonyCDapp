import React, { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { accordionAnimation } from '~constants/accordionAnimation';
import { formatText } from '~utils/intl';
import FormButtonRadioButtons from '~v5/common/Fields/RadioButtons/ButtonRadioButtons/FormButtonRadioButtons';
import VoteChart from '~v5/shared/VoteChart';
import { STAKING_RADIO_BUTTONS } from '../../../../consts';
import { StakingFormProps } from './types';
import Numeral from '~shared/Numeral';
import Button from '~v5/shared/Button';
import FormFormattedInput from '~v5/common/Fields/InputBase/FormFormattedInput';
import { useStakingSlider } from './useStakingSlider';

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
  } = useStakingSlider(transactionId);

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
        thresholdLabel="Threshold"
        className="mb-6"
      />
      <div>
        <FormButtonRadioButtons name="voteType" items={STAKING_RADIO_BUTTONS} />
      </div>
      <AnimatePresence>
        {getValues('voteType') && (
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
              formattingOptions={{
                numeral: true,
                numeralPositiveOnly: true,
                numeralDecimalScale: nativeTokenDecimals,
                prefix: nativeTokenSymbol,
                // @todo: fix this - right now prefix is not moved to the end of the text
                tailPrefix: true,
              }}
              buttonProps={{
                label: formatText({ id: 'button.max' }) || '',
                onClick: () => {
                  // @todo: add proper value
                  setValue('amount', requiredStake, {
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
