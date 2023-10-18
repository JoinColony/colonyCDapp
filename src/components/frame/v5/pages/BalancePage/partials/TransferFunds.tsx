import React, { FC } from 'react';
import { InferType } from 'yup';
import { ActionForm } from '~shared/Fields';
import { useTransferFunds } from '../hooks';
import { TransferFundsProps } from '../types';
import Button from '~v5/shared/Button';
import TokensSelect from '~v5/shared/TokensSelect';
import { FormFormattedInput } from '~v5/common/Fields/InputBase';
import { formatText } from '~utils/intl';

export const displayName = 'v5.pages.BalancePage.partials.TransferFundsForm';

const TransferFunds: FC<TransferFundsProps> = ({ onClose }) => {
  const { actionType, transform, colony, validationSchema, tokenDecimals } =
    useTransferFunds();

  type TransferFundsFormValues = InferType<typeof validationSchema>;

  return (
    <ActionForm<TransferFundsFormValues>
      defaultValues={{
        forceAction: false,
        amount: 0,
        tokenAddress: colony?.nativeToken.tokenAddress,
      }}
      validationSchema={validationSchema}
      actionType={actionType}
      transform={transform}
      onSuccess={(_, { reset }) => {
        reset();
        onClose();
      }}
    >
      <>
        <p className="text-1">
          {formatText({ id: 'balancePage.modal.add.funds.form.label' })}
        </p>
        <div className="flex items-center gap-2">
          <FormFormattedInput
            name="amount"
            options={{
              numeral: true,
              numeralDecimalScale: tokenDecimals,
              numeralPositiveOnly: true,
              rawValueTrimPrefix: true,
              tailPrefix: true,
            }}
            buttonProps={{
              label: formatText({ id: 'button.max' }) || '',
            }}
          />
          <div className="bg-base-white rounded border px-2 py-3 border-gray-300 min-w-[110px]">
            <TokensSelect
              name="tokenAddress"
              avatarSize="xxs"
              hasAdditionalInformation={false}
              hasIcon
            />
          </div>
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row mt-8">
          <Button
            mode="primaryOutline"
            onClick={onClose}
            text={formatText({ id: 'button.cancel' })}
            isFullSize
          />
          <Button
            mode="primarySolid"
            type="submit"
            text={formatText({ id: 'button.addFunds' })}
            isFullSize
          />
        </div>
      </>
    </ActionForm>
  );
};

TransferFunds.displayName = displayName;

export default TransferFunds;
