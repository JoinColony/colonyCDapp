import get from 'lodash/get';
import React, { type ChangeEvent, type FC } from 'react';
import { type Message, useFormContext, useWatch } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { ExtendedSupportedCurrencies } from '~gql';
import Numeral from '~shared/Numeral/index.ts';
import { formatMessage } from '~utils/yup/tests/helpers.ts';

import CardHeader from './CardHeader.tsx';
import CardInput from './CardInput.tsx';
import CardWrapper from './CardWrapper.tsx';
import {
  getConvertedAmount,
  getFormattedStringNumeral,
  getUnformattedStringNumeral,
} from './helpers.ts';
import { TransferFields } from './hooks.ts';

const displayName = 'common.Extensions.UserHub.partials.WithdrawCard';

const MSG = defineMessages({
  withdraw: {
    id: `${displayName}.withdraw`,
    defaultMessage: 'Withdraw',
  },
  balance: {
    id: `${displayName}.balance`,
    defaultMessage: 'Balance: ',
  },
});

interface WithdrawCardProps {
  isFormDisabled: boolean;
  balance: number;
  conversionRate: number;
  handleSetMax: () => void;
  isLoading: boolean;
}

const AMOUNT_TRANSFER_FIELD_NAME = TransferFields.AMOUNT;

const WithdrawCard: FC<WithdrawCardProps> = ({
  isFormDisabled,
  balance,
  conversionRate,
  handleSetMax,
  isLoading,
}) => {

  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const amountValue = useWatch({ name: AMOUNT_TRANSFER_FIELD_NAME });
  const error = get(errors, AMOUNT_TRANSFER_FIELD_NAME)?.message as
    | Message
    | undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const unformattedValue = getUnformattedStringNumeral(event.target.value);
    const formattedValue = getFormattedStringNumeral(event.target.value);
    const numberValue = parseFloat(unformattedValue);

    const convertedAmount = Number.isNaN(numberValue)
      ? 0
      : getConvertedAmount(numberValue, conversionRate);

    const formattedConvertedAmount = getFormattedStringNumeral(convertedAmount);

    setValue(AMOUNT_TRANSFER_FIELD_NAME, formattedValue, {
      shouldValidate: true,
    });
    setValue(TransferFields.CONVERTED_AMOUNT, formattedConvertedAmount, {
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
          title={formatMessage(MSG.withdraw)}
          isFormDisabled={isFormDisabled}
          handleSetMax={handleSetMax}
          isLoading={isLoading}
        >
          <LoadingSkeleton
            className="h-4 w-[70px] rounded"
            isLoading={isLoading}
          >
            <Numeral prefix={formatMessage(MSG.balance)} value={balance} />
          </LoadingSkeleton>
        </CardHeader>
        <CardInput
          isFormDisabled={isFormDisabled}
          value={amountValue}
          onChange={handleChange}
          symbol={ExtendedSupportedCurrencies.Usdc}
          name={AMOUNT_TRANSFER_FIELD_NAME}
          isLoading={isLoading}
        />
      </CardWrapper>
      {hasError && <p className="text-sm text-negative-400">{error}</p>}
    </>
  );
};

WithdrawCard.displayName = displayName;

export default WithdrawCard;
