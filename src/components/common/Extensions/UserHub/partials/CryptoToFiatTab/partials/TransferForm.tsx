import { SpinnerGap } from '@phosphor-icons/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import IconButton from '~v5/shared/Button/IconButton.tsx';

import { getConvertedAmount } from './helpers.ts';
import ReceiveCard from './ReceiveCard.tsx';
import SummaryCard from './SummaryCard.tsx';
import WithdrawCard from './WithdrawCard.tsx';

const displayName = 'common.Extensions.UserHub.partials.TransferForm';

const TransferForm = ({
  isFormDisabled,
  isKycStatusLoading,
}: {
  isFormDisabled: boolean;
  isKycStatusLoading: boolean;
}) => {
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
          isLoading={isKycStatusLoading}
        />
        <ReceiveCard
          isFormDisabled={isFormDisabled}
          handleSetMax={handleSetMax}
          isLoading={isKycStatusLoading}
        />
        <SummaryCard
          isFormDisabled={isFormDisabled}
          isLoading={isKycStatusLoading}
        />
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
        <div className="mb-6 mt-20 sm:mt-6">
          <LoadingSkeleton
            className="my-6 h-10 w-full rounded-lg"
            isLoading={isKycStatusLoading}
          >
            <Button
              mode="primarySolid"
              type="submit"
              text={formatText({ id: `button.transfer` })}
              isFullSize
              disabled={isFormDisabled}
            />
          </LoadingSkeleton>
        </div>
      )}
    </>
  );
};

TransferForm.displayName = displayName;

export default TransferForm;
