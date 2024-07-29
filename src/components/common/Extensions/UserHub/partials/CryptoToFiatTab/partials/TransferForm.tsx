import { SpinnerGap } from '@phosphor-icons/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import IconButton from '~v5/shared/Button/IconButton.tsx';

import { getConvertedAmount } from './helpers.ts';
import ReceiveCard from './ReceiveCard.tsx';
import SummaryCard from './SummaryCard.tsx';
import WithdrawCard from './WithdrawCard.tsx';

const displayName = 'common.Extensions.UserHub.partials.TransferForm';

const TransferForm = ({ isFormDisabled }: { isFormDisabled: boolean }) => {
  const {
    formState: { isSubmitting, isLoading },
    setValue,
  } = useFormContext();

  // @TODO: get actual token balance
  const balance = 123000000;

  const handleSetMax = () => {
    // @TODO: Get actual conversion rate
    const convertedAmount = getConvertedAmount(balance, 2);
    setValue('amount', balance);
    setValue('convertedAmount', convertedAmount);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <WithdrawCard
          isFormDisabled={isFormDisabled}
          balance={balance}
          handleSetMax={handleSetMax}
        />
        <ReceiveCard
          isFormDisabled={isFormDisabled}
          handleSetMax={handleSetMax}
        />
        <SummaryCard isFormDisabled={isFormDisabled} />
      </div>
      {isSubmitting || isLoading ? (
        <IconButton
          className="my-6 w-full"
          rounded="s"
          text={{ id: 'button.transfer' }}
          icon={
            <span className="ml-1.5 flex shrink-0">
              <SpinnerGap className="animate-spin" size={14} />
            </span>
          }
        />
      ) : (
        <Button
          mode="primarySolid"
          type="submit"
          text={formatText({ id: `button.transfer` })}
          className="my-6"
          isFullSize
          disabled={isFormDisabled}
        />
      )}
    </>
  );
};

TransferForm.displayName = displayName;

export default TransferForm;
