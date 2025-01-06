import { CopySimple, Plus, Trash } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useEffect, type FC } from 'react';
import { useFieldArray, useWatch, useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { SplitPaymentDistributionType } from '~gql';
import { useTablet } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import { MEATBALL_MENU_COLUMN_ID } from '~v5/common/Table/consts.ts';
import { Table } from '~v5/common/Table/Table.tsx';
import {
  getMoreActionsMenu,
  renderCellContent,
} from '~v5/common/Table/utils.tsx';
import Button from '~v5/shared/Button/Button.tsx';

import {
  useRecipientsFieldTableColumns,
  useDistributionMethodUpdate,
} from './hooks.tsx';
import {
  type SplitPaymentRecipientsFieldModel,
  type SplitPaymentRecipientsFieldProps,
  type SplitPaymentRecipientsTableModel,
} from './types.ts';
import { calculatePercentageValue } from './utils.ts';

const SplitPaymentRecipientsField: FC<SplitPaymentRecipientsFieldProps> = ({
  name,
  distributionMethod,
  token,
  disabled,
}) => {
  const fieldArrayMethods = useFieldArray({
    name,
  });
  const data: SplitPaymentRecipientsTableModel[] = fieldArrayMethods.fields.map(
    ({ id }) => ({
      key: id,
    }),
  );
  const value: SplitPaymentRecipientsFieldModel[] = useWatch({ name }) || [];
  const amount: string | undefined = useWatch({ name: 'amount' });
  const isTablet = useTablet();
  const getMenuProps = ({ index }) => ({
    cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
    items: [
      {
        key: 'duplicate',
        onClick: () => fieldArrayMethods.insert(index + 1, value[index]),
        label: formatText({ id: 'table.row.duplicate' }),
        icon: CopySimple,
      },
      {
        key: 'remove',
        onClick: () => fieldArrayMethods.remove(index),
        label: formatText({ id: 'table.row.remove' }),
        icon: Trash,
      },
    ],
  });
  const columns = useRecipientsFieldTableColumns({
    name,
    token,
    data: value,
    amount,
    fieldArrayMethods,
    disabled,
    distributionMethod,
    getMenuProps,
  });
  const { getFieldState, watch } = useFormContext();
  const fieldState = getFieldState(name);

  useDistributionMethodUpdate({
    distributionMethod,
    data: value,
    fieldArrayMethods,
    amount,
  });

  useEffect(() => {
    const includesDifferentToken = value.some(
      ({ tokenAddress }) => tokenAddress !== token.tokenAddress,
    );

    if (!includesDifferentToken) {
      return;
    }

    value?.forEach((_, index) => {
      fieldArrayMethods.update(index, {
        ...(value[index] || {}),
        tokenAddress: token.tokenAddress,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldArrayMethods, token]);

  useEffect(() => {
    const subscription = watch((formValues, { name: fieldName = '', type }) => {
      const fieldNameParts = fieldName.split('.');

      if (
        fieldNameParts[0] !== 'amount' ||
        !formValues.amount ||
        distributionMethod !== SplitPaymentDistributionType.Unequal
      ) {
        return;
      }

      if (type === 'change') {
        value?.forEach(({ amount: fieldAmount }, index) => {
          fieldArrayMethods.update(index, {
            ...(value[index] || {}),
            percent: calculatePercentageValue(fieldAmount, formValues.amount),
          });
        });
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distributionMethod, fieldArrayMethods, watch]);

  return (
    <div>
      <h5 className="mb-3 mt-6 text-2">
        {formatText({ id: 'actionSidebar.payments' })}
      </h5>
      {!!data.length && (
        <Table<SplitPaymentRecipientsTableModel>
          className={clsx(
            '[&_tfoot>tr>td]:border-gray-200 [&_tfoot>tr>td]:py-2 md:[&_tfoot>tr>td]:border-t',
            {
              '[&_tfoot>tr>td:empty]:hidden [&_th]:w-[6.125rem]': isTablet,
              '[&_table]:table-auto lg:[&_table]:table-fixed [&_tbody_td]:h-[3.375rem] [&_td:first-child]:pl-4 [&_td]:pr-4 [&_tfoot_td:first-child]:pl-4 [&_tfoot_td:not(:first-child)]:pl-0 [&_tfoot_td]:h-[2.875rem] [&_th:first-child]:pl-4 [&_th:not(:first-child)]:pl-0 [&_th]:pr-4':
                !isTablet,
              '!border-negative-400 md:[&_tfoot_td]:!border-negative-400 md:[&_th]:border-negative-400':
                !!fieldState.error,
            },
          )}
          columns={columns}
          data={data}
          borders={{
            type: 'unset',
            visible: true,
          }}
          layout={isTablet ? 'vertical' : 'horizontal'}
          isDisabled={disabled}
          renderCellWrapper={renderCellContent}
          footerColSpan={isTablet ? 2 : undefined}
          overrides={{
            getRowId: ({ key }) => key,
            state: {
              columnVisibility: {
                [MEATBALL_MENU_COLUMN_ID]: !disabled && !isTablet,
                percent: !isTablet,
              },
              pagination: {
                pageSize: data.length,
                pageIndex: 0,
              },
            },
          }}
          moreActions={getMoreActionsMenu({
            getMenuProps,
            visible: isTablet,
          })}
        />
      )}
      <Button
        mode="primaryOutline"
        icon={Plus}
        size="small"
        className="mt-6 w-full sm:w-auto"
        onClick={() => {
          fieldArrayMethods.append({
            recipient: undefined,
            amount: undefined,
            tokenAddress: token.tokenAddress,
            percent: undefined,
          });
        }}
        disabled={disabled}
      >
        <FormattedMessage id="button.addRecipient" />
      </Button>
    </div>
  );
};

export default SplitPaymentRecipientsField;
