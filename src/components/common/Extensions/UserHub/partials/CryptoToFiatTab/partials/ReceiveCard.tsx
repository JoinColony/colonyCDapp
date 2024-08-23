import React, { type ChangeEvent, type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import EthereumIcon from '~icons/EthereumIcon.tsx';
import { formatMessage } from '~utils/yup/tests/helpers.ts';

import CardHeader from './CardHeader.tsx';
import CardInput from './CardInput.tsx';
import CardWrapper from './CardWrapper.tsx';
import { getUnconvertedAmount } from './helpers.ts';

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
});

interface ReceiveCardProps {
  isFormDisabled: boolean;
  handleSetMax: () => void;
  isLoading: boolean;
}

const ReceiveCard: FC<ReceiveCardProps> = ({
  isFormDisabled,
  handleSetMax,
  isLoading,
}) => {
  const name = 'convertedAmount';

  const { getValues, setValue, getFieldState } = useFormContext();

  const { error } = getFieldState(name);

  const amountValue = getValues(name);

  // @TODO: Get actual conversion rate
  const conversionRate = '0.93';
  //  @TODO: Get selected currency from user preferences
  const selectedCurrency = 'EUR';

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const formattedAmount = Number(event.target.value);
    // @TODO: Get actual conversion amount
    const tokenAmount = getUnconvertedAmount(formattedAmount, 2);
    setValue(name, formattedAmount);
    setValue('amount', tokenAmount);
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
            <p>
              {formatMessage(MSG.oneUSDC)}
              <span className="font-medium">
                {conversionRate} {selectedCurrency}
              </span>
            </p>
          </LoadingSkeleton>
        </CardHeader>
        <CardInput
          isFormDisabled={isFormDisabled}
          // @TODO: Swap out correct icon
          icon={EthereumIcon}
          value={amountValue}
          onChange={handleChange}
          symbol={selectedCurrency}
          name={name}
          isLoading={isLoading}
        />
      </CardWrapper>
      {hasError && <p className="text-sm text-negative-400">{error.message}</p>}
    </>
  );
};

ReceiveCard.displayName = displayName;

export default ReceiveCard;
