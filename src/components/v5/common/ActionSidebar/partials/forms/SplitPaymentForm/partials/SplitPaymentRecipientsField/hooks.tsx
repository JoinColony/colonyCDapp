import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useCallback, useEffect } from 'react';

import { useMemberContext } from '~context/MemberContext.tsx';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import Numeral from '~shared/Numeral/index.ts';
import TokenIcon from '~shared/TokenIcon/index.ts';
import { type ColonyContributor, type Token } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import {
  DISTRIBUTION_METHOD,
  type DistributionMethod,
} from '~v5/common/ActionSidebar/partials/consts.tsx';
import UserSelect from '~v5/common/ActionSidebar/partials/UserSelect/index.ts';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase.tsx';
import { type TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types.ts';

import {
  type SplitPaymentRecipientsFieldModel,
  type SplitPaymentRecipientsTableModel,
} from './types.ts';

export const useRecipientsFieldTableColumns = (
  name: string,
  token: Token,
  distributionMethod: DistributionMethod,
  data: SplitPaymentRecipientsFieldModel[],
  amount: number,
  { update },
): ColumnDef<SplitPaymentRecipientsTableModel, string>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<SplitPaymentRecipientsTableModel>(),
    [],
  );
  const dataRef = useWrapWithRef(data);
  const getPercentValue = useCallback((index: number): number => {
    const percent = dataRef.current?.[index]?.percent || 0;

    return percent;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnDef<SplitPaymentRecipientsTableModel, string>[] =
    useMemo(
      () => [
        columnHelper.display({
          id: 'recipient',
          header: () => formatText({ id: 'table.row.recipient' }),
          cell: ({ row }) => (
            <UserSelect key={row.id} name={`${name}.${row.index}.recipient`} />
          ),
          footer: () => (
            <span className="text-gray-400">
              {formatText({ id: 'table.footer.total' })}
            </span>
          ),
        }),
        columnHelper.display({
          id: 'amount',
          header: () => formatText({ id: 'table.row.amount' }),
          cell: ({ row }) => (
            <div className="flex items-center gap-3">
              <Numeral
                className="text-md"
                value={(getPercentValue(row.index) / 100) * amount}
              />
              <TokenIcon token={token} size="xs" />
              <span className="text-md">{token.symbol}</span>
            </div>
          ),
          footer: () => (
            <div className="flex items-center gap-3">
              <Numeral
                className="text-md font-semibold"
                value={dataRef.current?.reduce(
                  (acc, _, index) =>
                    acc + (getPercentValue(index) / 100) * amount,
                  0,
                )}
              />
              <TokenIcon token={token} size="xs" />
              <span className="text-md font-semibold">{token.symbol}</span>
            </div>
          ),
        }),
        columnHelper.display({
          id: 'percent',
          header: () => formatText({ id: 'table.row.percent' }),
          cell: ({ row }) =>
            distributionMethod === DISTRIBUTION_METHOD.Unequal ? (
              <FormInputBase
                autoWidth
                onBlur={() => {
                  const maxPercent =
                    100 -
                    (dataRef.current?.reduce(
                      (acc, _, index) =>
                        index === row.index
                          ? acc
                          : acc + getPercentValue(index),
                      0,
                    ) || 0);

                  if (getPercentValue(row.index) <= maxPercent) {
                    return;
                  }

                  update(row.index, {
                    ...(dataRef.current?.[row.index] || {}),
                    percent: maxPercent,
                  });
                }}
                wrapperClassName="flex-row flex"
                min={0}
                max={100}
                key={row.id}
                name={`${name}.${row.index}.percent`}
                type="number"
                mode="secondary"
                suffix="%"
              />
            ) : (
              <span className="text-md">
                {parseFloat(getPercentValue(row.index).toFixed(2))}%
              </span>
            ),
          footer: () => (
            <span className="text-md font-semibold">
              {parseFloat(
                (
                  dataRef.current?.reduce(
                    (acc, _, index) => acc + getPercentValue(index),
                    0,
                  ) || 0
                ).toFixed(2),
              )}
              %
            </span>
          ),
        }),
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [amount, columnHelper, distributionMethod, name, token],
    );

  return columns;
};

export const useGetTableMenuProps = (
  { remove, insert },
  data: SplitPaymentRecipientsFieldModel[],
) =>
  useCallback<
    TableWithMeatballMenuProps<SplitPaymentRecipientsTableModel>['getMenuProps']
  >(
    ({ index }) => ({
      cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
      items: [
        {
          key: 'duplicate',
          onClick: () => insert(index + 1, data[index]),
          label: formatText({ id: 'table.row.duplicate' }),
          icon: 'copy-simple',
        },
        {
          key: 'remove',
          onClick: () => remove(index),
          label: formatText({ id: 'table.row.remove' }),
          icon: 'trash',
        },
      ],
    }),
    [remove, insert, data],
  );

export const useDistributionMethodUpdate = (
  distributionMethod: DistributionMethod,
  data: { recipient?: string; percent?: number }[] | undefined,
  { update },
  amount: number,
) => {
  const { filteredContributors } = useMemberContext();

  useEffect(() => {
    (async () => {
      switch (distributionMethod) {
        case DISTRIBUTION_METHOD.Equal: {
          const percentPerRecipient = 100 / (data?.length || 1);

          data?.forEach((_, index) => {
            update(index, {
              ...(data[index] || {}),
              percent: percentPerRecipient,
            });
          });

          break;
        }
        case DISTRIBUTION_METHOD.ReputationPercentage: {
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

          data?.forEach(({ recipient }, index) => {
            const contributor = recipient
              ? selectedColonyMembers[recipient.toLowerCase()]
              : undefined;

            update(index, {
              ...(data[index] || {}),
              percent: contributor?.colonyReputationPercentage
                ? (Number(contributor.colonyReputationPercentage) /
                    totalReputationPercentage) *
                  100
                : 0,
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
    distributionMethod,
    amount,
    update,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(data),
    filteredContributors,
  ]);
};
