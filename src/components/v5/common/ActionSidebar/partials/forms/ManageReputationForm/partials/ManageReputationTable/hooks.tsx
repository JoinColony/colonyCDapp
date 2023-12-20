import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { CleaveOptions } from 'cleave.js/options';
import Decimal from 'decimal.js';
import React, { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { useColonyContext, useUserReputation } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';
import { formatText } from '~utils/intl';
import { calculatePercentageReputation } from '~utils/reputation';
import {
  getFormattedTokenValue,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import { FormFormattedInput } from '~v5/common/Fields/InputBase';
import { ModificationOption } from '../../consts';

export interface ManageReputationTableModel {
  key: string;
}

const calculateNewValue = (
  firstValue: string | undefined,
  secondValue: string,
  isSmite?: boolean,
) =>
  isSmite
    ? new Decimal(firstValue || 0).sub(secondValue).toString()
    : new Decimal(firstValue || 0).add(secondValue).toString();

export const useManageReputationTableColumns = (
  name: string,
): ColumnDef<ManageReputationTableModel, string>[] => {
  const { setValue } = useFormContext();
  const {
    team: domainId,
    modification: selectedModification,
    amount,
    member: selectedUser,
  } = useWatch<{
    team: string;
    modification: string;
    amount: string;
    member: string;
  }>();
  const { colony } = useColonyContext();
  const { colonyAddress, nativeToken } = colony || {};
  const { decimals } = nativeToken || {};
  const nativeTokenDecimals = getTokenDecimalsWithFallback(decimals);

  const columnHelper = useMemo(
    () => createColumnHelper<ManageReputationTableModel>(),
    [],
  );

  const {
    userReputation,
    totalReputation,
    loading: userReputationLoading,
  } = useUserReputation(colonyAddress, selectedUser, Number(domainId));

  const unformattedUserReputationAmount = new Decimal(userReputation || 0)
    .div(new Decimal(10).pow(nativeTokenDecimals))
    .toNumber();

  const formattedUserReputationAmount = getFormattedTokenValue(
    userReputation || 0,
    nativeTokenDecimals,
  );

  const userPercentageReputation = calculatePercentageReputation(
    userReputation,
    totalReputation,
  );

  const isSmite = selectedModification === ModificationOption.RemoveReputation;

  const amountValueCalculated = new Decimal(amount || 0)
    .mul(new Decimal(10).pow(nativeTokenDecimals))
    .toString();

  const newReputation = calculateNewValue(
    userReputation,
    amountValueCalculated,
    isSmite,
  );

  const newTotalReputation = calculateNewValue(
    totalReputation,
    amountValueCalculated,
    isSmite,
  );

  const newPercentageReputation = calculatePercentageReputation(
    newReputation,
    newTotalReputation,
  );

  const formattedNewReputationAmount = getFormattedTokenValue(
    newReputation || 0,
    nativeTokenDecimals,
  );

  // @todo: add percentage value to input prefix
  // const changePercentage = isSmite
  //   ? new Decimal(userPercentageReputation || 0)
  //       .sub(newPercentageReputation || 0)
  //       .toString()
  //   : new Decimal(newPercentageReputation || 0)
  //       .sub(userPercentageReputation || 0)
  //       .toString();

  const formattingOptions: CleaveOptions = useMemo(
    () => ({
      numeral: true,
      tailPrefix: true,
      numeralDecimalScale: 4,
      numeralPositiveOnly: true,
      rawValueTrimPrefix: true,
      // prefix: ` Points (${
      //   changePercentage !== '0' ? changePercentage : '0.0'
      // }%)`,
    }),
    [],
  );

  const columns: ColumnDef<ManageReputationTableModel, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'currentReputation',
        header: () => formatText({ id: 'table.row.currentReputation' }),
        cell: () =>
          userReputationLoading && selectedUser && domainId ? (
            <SpinnerLoader />
          ) : (
            <p>
              {selectedUser && domainId
                ? `${formattedUserReputationAmount} Points (${
                    userPercentageReputation ?? '0.0'
                  }%)` || '0 Points (0.0%)'
                : '0 Points (0.0%)'}
            </p>
          ),
      }),
      columnHelper.display({
        id: 'change',
        header: () => formatText({ id: 'table.row.change' }),
        cell: () => (
          <FormFormattedInput
            disabled={userReputationLoading}
            name={name}
            options={formattingOptions}
            mode="secondary"
            buttonProps={
              isSmite
                ? {
                    label: formatText({ id: 'button.max' }) || '',
                    onClick: () =>
                      setValue(
                        'amount',
                        unformattedUserReputationAmount.toString(),
                        {
                          shouldTouch: true,
                          shouldValidate: true,
                          shouldDirty: true,
                        },
                      ),
                  }
                : undefined
            }
          />
        ),
      }),
      columnHelper.display({
        id: 'newReputation',
        header: () => formatText({ id: 'table.row.newReputation' }),
        cell: () => (
          <p>
            {amount && amount !== '0' ? formattedNewReputationAmount : '0'}{' '}
            Points (
            {newPercentageReputation !== '0' ? newPercentageReputation : '0.0'}
            %)
          </p>
        ),
      }),
    ],
    [
      amount,
      columnHelper,
      domainId,
      formattedNewReputationAmount,
      formattedUserReputationAmount,
      formattingOptions,
      isSmite,
      name,
      newPercentageReputation,
      selectedUser,
      setValue,
      unformattedUserReputationAmount,
      userPercentageReputation,
      userReputationLoading,
    ],
  );

  return columns;
};
