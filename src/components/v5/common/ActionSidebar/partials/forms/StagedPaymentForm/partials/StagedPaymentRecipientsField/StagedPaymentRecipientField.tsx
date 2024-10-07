import { CopySimple, Plus, Trash } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile, useTablet } from '~hooks';
import { formatText } from '~utils/intl.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import Table from '~v5/common/Table/Table.tsx';
import Button from '~v5/shared/Button/Button.tsx';

import { useStagedPaymentTableColumns } from './hooks.tsx';
import {
  type StagedPaymentRecipientsTableModel,
  type StagedPaymentRecipientsFieldProps,
  type StagedPaymentRecipientsFieldModel,
} from './types.ts';

const StagedPaymentRecipientsField: FC<StagedPaymentRecipientsFieldProps> = ({
  name,
}) => {
  const hasNoDecisionMethods = useHasNoDecisionMethods();
  const {
    colony: { nativeToken },
  } = useColonyContext();

  const isTablet = useTablet();
  const isMobile = useMobile();
  const { fields, append, insert, remove } = useFieldArray({
    name,
  });

  const data: StagedPaymentRecipientsTableModel[] = fields.map(({ id }) => ({
    key: id,
  }));
  const value: StagedPaymentRecipientsFieldModel[] = useWatch({ name }) || [];
  const columns = useStagedPaymentTableColumns(name, value);
  const { getFieldState } = useFormContext();
  const fieldState = getFieldState(name);
  const getMenuProps = ({ index }) => ({
    cardClassName: 'sm:min-w-[9.625rem]',
    items: [
      {
        key: 'duplicate',
        onClick: () =>
          insert(index + 1, {
            ...value[index],
          }),
        label: formatText({ id: 'table.row.duplicate' }),
        icon: CopySimple,
      },
      ...(value.length > 1
        ? [
            {
              key: 'remove',
              onClick: () => remove(index),
              label: formatText({ id: 'table.row.remove' }),
              icon: Trash,
            },
          ]
        : []),
    ],
  });

  return (
    <div>
      <h5 className="mb-3 mt-6 text-2">
        {formatText({ id: 'actionSidebar.stages' })}
      </h5>
      {!!data.length && !hasNoDecisionMethods && (
        <Table<StagedPaymentRecipientsTableModel>
          className={clsx(
            '[&_tfoot>tr>td]:border-gray-200 [&_tfoot>tr>td]:py-2 md:[&_tfoot>tr>td]:border-t',
            {
              '[&_tfoot>tr>td:empty]:hidden [&_th]:w-[6.25rem]': isTablet,
              '[&_table]:table-auto lg:[&_table]:table-fixed [&_td:first-child]:pl-4 [&_td]:pr-5 [&_tfoot_td:first-child]:pl-4 [&_tfoot_td:not(:first-child)]:pl-0 [&_th:first-child]:pl-4 [&_th:not(:first-child)]:pl-0 [&_th]:pr-5':
                !isTablet,
              '!border-negative-400 md:[&_tfoot_td]:!border-negative-400 md:[&_th]:border-negative-400':
                !!fieldState.error,
            },
          )}
          verticalLayout={isTablet}
          getRowId={({ key }) => key}
          columns={columns}
          data={data}
          getMenuProps={getMenuProps}
          withBorder={false}
          footerColSpan={isMobile ? 2 : 1}
          renderCellWrapper={(_, content) => content}
          initialState={{
            pagination: {
              pageSize: 400,
            },
          }}
        />
      )}
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
        <Button
          mode="primaryOutline"
          icon={Plus}
          size="small"
          isFullSize={isMobile}
          onClick={() => {
            append({
              milestone: '',
              amount: '',
              tokenAddress: nativeToken?.tokenAddress || '',
            });
          }}
          disabled={hasNoDecisionMethods || data.length === 400}
        >
          {formatText({ id: 'button.addMilestone' })}
        </Button>
      </div>
    </div>
  );
};

export default StagedPaymentRecipientsField;
