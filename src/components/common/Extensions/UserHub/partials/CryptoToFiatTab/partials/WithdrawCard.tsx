import React, { type ChangeEvent, type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import EthereumIcon from '~icons/EthereumIcon.tsx';
import Numeral from '~shared/Numeral/index.ts';
import { formatMessage } from '~utils/yup/tests/helpers.ts';

import CardHeader from './CardHeader.tsx';
import CardInput from './CardInput.tsx';
import CardWrapper from './CardWrapper.tsx';
import { getConvertedAmount } from './helpers.ts';

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
  handleSetMax: () => void;
}

const WithdrawCard: FC<WithdrawCardProps> = ({
  isFormDisabled,
  balance,
  handleSetMax,
}) => {
  const name = 'amount';

  const { getValues, setValue, getFieldState } = useFormContext();

  const { error } = getFieldState(name);

  const amountValue = getValues(name);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const formattedAmount = Number(event.target.value);
    // @TODO: Get actual conversion amount
    const convertedAmount = getConvertedAmount(formattedAmount, 2);
    setValue(name, formattedAmount);
    setValue('convertedAmount', convertedAmount);
  };

  const hasError = !!error;

  return (
    <>
      <CardWrapper isFormDisabled={isFormDisabled} hasError={hasError}>
        <CardHeader
          title={formatMessage(MSG.withdraw)}
          isFormDisabled={isFormDisabled}
          handleSetMax={handleSetMax}
        >
          <Numeral
            prefix={formatMessage(MSG.balance)}
            value={balance}
            decimals={6}
          />
        </CardHeader>
        <CardInput
          isFormDisabled={isFormDisabled}
          icon={EthereumIcon}
          value={amountValue}
          onChange={handleChange}
          symbol="USDC"
          name={name}
        />
      </CardWrapper>
      {hasError && <p className="text-sm text-negative-400">{error.message}</p>}
    </>
  );
};

WithdrawCard.displayName = displayName;

export default WithdrawCard;
