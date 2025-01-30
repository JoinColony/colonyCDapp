import { Id } from '@colony/colony-js';
import {
  createColumnHelper,
  type Row,
  type ColumnDef,
} from '@tanstack/react-table';
import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import React, { useMemo, useCallback, useEffect } from 'react';
import { type FieldValues, type UseFieldArrayReturn } from 'react-hook-form';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { SplitPaymentDistributionType } from '~gql';
import { useTablet } from '~hooks';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { type ColonyContributor, type Token } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { getSelectedToken } from '~utils/tokens.ts';
import { getUnevenSplitPaymentTotalPercentage } from '~v5/common/ActionSidebar/partials/forms/SplitPaymentForm/utils.ts';
import UserSelect, {
  type UserSearchSelectOption,
} from '~v5/common/ActionSidebar/partials/UserSelect/index.ts';
import { makeMenuColumn } from '~v5/common/Table/utils.tsx';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

import SplitPaymentAmountField from '../SplitPaymentAmountField/SplitPaymentAmountField.tsx';
import SplitPaymentPayoutsTotal from '../SplitPaymentPayoutsTotal/SplitPaymentPayoutsTotal.tsx';
import SplitPaymentPercentField from '../SplitPaymentPercentField/SplitPaymentPercentField.tsx';

import {
  type SplitPaymentRecipientsFieldModel,
  type SplitPaymentRecipientsTableModel,
} from './types.ts';
import { calculatePercentageValue } from './utils.ts';

export const useRecipientsFieldTableColumns = ({
  name,
  token,
  data,
  amount,
  fieldArrayMethods: { update },
  disabled,
  distributionMethod,
  getMenuProps,
  domainId = Id.RootDomain,
}: {
  name: string;
  token: Token;
  data: SplitPaymentRecipientsFieldModel[];
  amount: string | undefined;
  fieldArrayMethods: UseFieldArrayReturn<FieldValues, string, 'id'>;
  disabled?: boolean;
  distributionMethod?: SplitPaymentDistributionType;
  getMenuProps: (
    row: Row<SplitPaymentRecipientsTableModel>,
  ) => MeatBallMenuProps | undefined;
  domainId?: number;
}): ColumnDef<SplitPaymentRecipientsTableModel, string>[] => {
  const isTablet = useTablet();
  const columnHelper = useMemo(
    () => createColumnHelper<SplitPaymentRecipientsTableModel>(),
    [],
  );
  const dataRef = useWrapWithRef(data);
  const distributionMethodRef = useWrapWithRef(distributionMethod);
  const getPercentValue = useCallback((index: number): number => {
    const percent = dataRef.current?.[index]?.percent || 0;

    return percent;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const filterUsersWithReputation = (userOption: UserSearchSelectOption) => {
    return userOption?.userReputation
      ? BigNumber.from(userOption.userReputation).gt(0)
      : false;
  };

  const menuColumn = useMemo(
    () =>
      makeMenuColumn({
        helper: columnHelper,
        getMenuProps,
      }),
    [columnHelper, getMenuProps],
  );

  const columns: ColumnDef<SplitPaymentRecipientsTableModel, string>[] =
    useMemo(
      () => [
        columnHelper.display({
          id: 'recipient',
          header: () => formatText({ id: 'table.row.recipient' }),
          cell: ({ row }) => (
            <UserSelect
              key={row.id}
              name={`${name}.${row.index}.recipient`}
              disabled={disabled}
              domainId={domainId}
              filterOptionsFn={
                distributionMethodRef?.current ===
                SplitPaymentDistributionType.Reputation
                  ? filterUsersWithReputation
                  : undefined
              }
            />
          ),
          footer: () => (
            <span className="text-gray-400 text-4">
              {formatText({ id: 'table.footer.total' })}
            </span>
          ),
        }),
        columnHelper.display({
          id: 'amount',
          header: () => formatText({ id: 'table.row.amount' }),
          cell: ({ row }) => (
            <SplitPaymentAmountField
              key={row.id}
              name={`${name}.${row.index}.amount`}
              tokenAddressFieldName={`${name}.${row.index}.tokenAddress`}
              isDisabled={disabled}
              onBlur={
                amount
                  ? () => {
                      const percentCalculated = calculatePercentageValue(
                        dataRef.current?.[row.index].amount,
                        amount,
                      );

                      if (percentCalculated === getPercentValue(row.index)) {
                        return;
                      }

                      update(row.index, {
                        ...(dataRef.current?.[row.index] || {}),
                        percent: percentCalculated,
                      });
                    }
                  : undefined
              }
            />
          ),
          footer: () => (
            <div className="flex items-center justify-end gap-9 md:justify-start">
              <SplitPaymentPayoutsTotal
                data={dataRef.current || []}
                token={token}
                value={
                  distributionMethodRef?.current ===
                    SplitPaymentDistributionType.Equal &&
                  (amount ? moveDecimal(amount, token.decimals) : 0)
                }
                convertToWEI
              />
              {isTablet && (
                <span className="text-md font-medium text-gray-900">
                  {distributionMethodRef?.current ===
                  SplitPaymentDistributionType.Equal
                    ? '100%'
                    : `${getUnevenSplitPaymentTotalPercentage(Number(amount || 0), dataRef.current)}%`}
                </span>
              )}
            </div>
          ),
          meta: {
            footer: {
              colSpan: isTablet ? 2 : undefined,
            },
          },
        }),
        columnHelper.display({
          id: 'percent',
          header: () => formatText({ id: 'table.row.percent' }),
          cell: ({ row }) => (
            <SplitPaymentPercentField
              onBlur={
                amount
                  ? () => {
                      const percentCalculated = getPercentValue(row.index);

                      const amountCalculated = new Decimal(amount)
                        .mul(percentCalculated)
                        .div(100)
                        .toDecimalPlaces(
                          token.decimals || DEFAULT_TOKEN_DECIMALS,
                        )
                        .toString();

                      if (
                        dataRef.current?.[row.index].amount === amountCalculated
                      ) {
                        return;
                      }

                      update(row.index, {
                        ...(dataRef.current?.[row.index] || {}),
                        amount: amountCalculated,
                      });
                    }
                  : undefined
              }
              key={row.id}
              name={`${name}.${row.index}.percent`}
              disabled={disabled}
            />
          ),
          footer: !isTablet
            ? () => {
                return (
                  <span className="text-md font-medium text-gray-900">
                    {distributionMethodRef?.current ===
                    SplitPaymentDistributionType.Equal
                      ? '100%'
                      : `${getUnevenSplitPaymentTotalPercentage(Number(amount || 0), dataRef.current)}%`}
                  </span>
                );
              }
            : undefined,
          meta: {
            footer: {
              display: isTablet ? 'none' : undefined,
            },
          },
        }),
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [amount, columnHelper, name, token, disabled, isTablet, domainId],
    );

  return menuColumn ? [...columns, menuColumn] : columns;
};

export const useDistributionMethodUpdate = ({
  distributionMethod,
  data,
  fieldArrayMethods: { update },
  amount,
}: {
  distributionMethod: SplitPaymentDistributionType | undefined;
  data: SplitPaymentRecipientsFieldModel[] | undefined;
  fieldArrayMethods: UseFieldArrayReturn<FieldValues, string, 'id'>;
  amount: string | undefined;
}) => {
  const { filteredContributors } = useMemberContext();
  const { colony } = useColonyContext();

  useEffect(() => {
    (async () => {
      switch (distributionMethod) {
        case SplitPaymentDistributionType.Equal: {
          const percentPerRecipient = 100 / (data?.length || 1);

          data?.forEach((_, index) => {
            update(index, {
              ...(data[index] || {}),
              percent: Number(percentPerRecipient.toFixed(4)),
              amount: amount
                ? new Decimal(amount)
                    .div(data.length || 1)
                    .toDecimalPlaces(
                      getSelectedToken(colony, data[index].tokenAddress || '')
                        ?.decimals || DEFAULT_TOKEN_DECIMALS,
                    )
                    .toFixed()
                : undefined,
            });
          });

          break;
        }
        case SplitPaymentDistributionType.Reputation: {
          const selectedColonyMembers =
            data?.reduce<Record<string, ColonyContributor>>(
              (acc, { recipient }) => {
                const contributor = filteredContributors?.find(
                  ({ contributorAddress }) =>
                    contributorAddress.toLowerCase() ===
                    recipient?.toLowerCase(),
                );

                if (!contributor) {
                  return acc;
                }

                return {
                  ...acc,
                  [contributor.contributorAddress.toLowerCase()]: contributor,
                };
              },
              {},
            ) || {};
          const totalReputationPercentage =
            data?.reduce<number>((acc, { recipient }) => {
              if (!recipient) {
                return acc;
              }

              const reputationPercentage =
                selectedColonyMembers[recipient.toLowerCase()]
                  ?.colonyReputationPercentage || 0;

              return acc + Number(reputationPercentage);
            }, 0) || 0;

          let sum = 0;

          data?.forEach(({ recipient }, index) => {
            const contributor = recipient
              ? selectedColonyMembers[recipient.toLowerCase()]
              : undefined;

            const lastRecipientIndex = data
              .map((item) => !!item.recipient)
              .lastIndexOf(true);

            const percent = contributor?.colonyReputationPercentage
              ? Number(
                  (
                    (contributor.colonyReputationPercentage /
                      totalReputationPercentage) *
                    100
                  ).toFixed(4),
                )
              : undefined;

            sum = index === lastRecipientIndex ? sum : sum + (percent || 0);

            const finalPercentage =
              index === lastRecipientIndex
                ? Number((100 - sum).toFixed(4))
                : percent;

            const amountCalculated =
              amount && finalPercentage
                ? new Decimal(amount)
                    .mul(finalPercentage)
                    .div(100)
                    .toDecimalPlaces(
                      getSelectedToken(colony, data[index].tokenAddress || '')
                        ?.decimals || DEFAULT_TOKEN_DECIMALS,
                    )
                    .toString()
                : undefined;

            update(index, {
              ...(data[index] || {}),
              percent: finalPercentage,
              amount: amountCalculated,
            });
          });

          break;
        }
        default:
          break;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    amount,
    colony, // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(data),
    distributionMethod,
    filteredContributors,
    update,
  ]);
};
