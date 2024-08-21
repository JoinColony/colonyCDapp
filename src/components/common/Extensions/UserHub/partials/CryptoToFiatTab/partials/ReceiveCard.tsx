import { format } from 'date-fns';
import get from 'lodash/get';
import React, { type ChangeEvent, type FC } from 'react';
import { type Message, useFormContext, useWatch } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { formatMessage } from '~utils/yup/tests/helpers.ts';

import CardHeader from './CardHeader.tsx';
import CardInput from './CardInput.tsx';
import CardWrapper from './CardWrapper.tsx';
import {
  getFormattedStringNumeral,
  getUnconvertedAmount,
  getUnformattedStringNumeral,
} from './helpers.ts';
import { TransferFields } from './hooks.ts';

const displayName = 'common.Extensions.UserHub.partials.ReceiveCard';

const MSG = defineMessages({
  receive: {
    id: `${displayName}.receive`,
    defaultMessage: 'Receive',
  },
  oneUSDC: {
    id: `${displayName}.oneUSDC`,
    defaultMessage: '1 USDC: ',
  },
  conversionRateTooltip: {
    id: `${displayName}.conversionRateTooltip`,
    defaultMessage: 'Conversion rate. Last updated {date}',
  },
});

interface ReceiveCardProps {
  isFormDisabled: boolean;
  handleSetMax: () => void;
  isLoading: boolean;
}

const CONVERTED_AMOUNT_TRANSFER_FIELD_NAME = TransferFields.CONVERTED_AMOUNT;

const ReceiveCard: FC<ReceiveCardProps> = ({
  isFormDisabled,
  handleSetMax,
  isLoading,
}) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const amountValue = useWatch({ name: CONVERTED_AMOUNT_TRANSFER_FIELD_NAME });
  const error = get(errors, CONVERTED_AMOUNT_TRANSFER_FIELD_NAME)?.message as
    | Message
    | undefined;

  const { currency: selectedCurrency } = useCurrencyContext();

  // @TODO: Get actual conversion rate
  const conversionRate = parseFloat('0.93');
  const conversionDate = new Date();
  const formattedConversionDateTime = format(conversionDate, `LLL dd 'at' p`);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const unformattedValue = getUnformattedStringNumeral(event.target.value);
    const formattedValue = getFormattedStringNumeral(event.target.value);
    const numberValue = parseFloat(unformattedValue);

    const tokenAmount = Number.isNaN(numberValue)
      ? 0
      : getUnconvertedAmount(numberValue, conversionRate);
    const formattedTokenAmount = getFormattedStringNumeral(
      tokenAmount.toString(),
    );

    setValue(CONVERTED_AMOUNT_TRANSFER_FIELD_NAME, formattedValue, {
      shouldValidate: true,
    });
    setValue(TransferFields.AMOUNT, formattedTokenAmount, {
      shouldValidate: true,
    });
  };

  const hasError = !!error;

  return (
    <>
      <CardWrapper
        isFormDisabled={isFormDisabled}
        hasError={hasError}
        isLoading={isLoading}
      >
        <CardHeader
          title={formatMessage(MSG.receive)}
          isFormDisabled={isFormDisabled}
          handleSetMax={handleSetMax}
          isLoading={isLoading}
        >
          <LoadingSkeleton
            className="h-4 w-[70px] rounded"
            isLoading={isLoading}
          >
            <Tooltip
              tooltipContent={formatMessage(MSG.conversionRateTooltip, {
                date: formattedConversionDateTime,
              })}
              placement="top-end"
              contentWrapperClassName="font-bold max-w-full"
              offset={[8, 12]}
            >
              <p>
                {formatMessage(MSG.oneUSDC)}
                <span className="font-medium">
                  {conversionRate} {selectedCurrency}
                </span>
              </p>
            </Tooltip>
          </LoadingSkeleton>
        </CardHeader>
        <CardInput
          isFormDisabled={isFormDisabled}
          value={amountValue}
          onChange={handleChange}
          symbol={selectedCurrency}
          name={CONVERTED_AMOUNT_TRANSFER_FIELD_NAME}
          isLoading={isLoading}
        />
      </CardWrapper>
      {hasError && <p className="text-sm text-negative-400">{error}</p>}
    </>
  );
};

ReceiveCard.displayName = displayName;

export default ReceiveCard;
