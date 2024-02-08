import { Plus, Trash } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.tsx';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import Table from '~v5/common/Table/index.ts';
import Button from '~v5/shared/Button/index.ts';

import { useTokensTableColumns } from './hooks.tsx';
import { type TokensTableModel, type TokensTableProps } from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.TokensTable';

const TokensTable: FC<TokensTableProps> = ({
  name,
  shouldShowMenu = () => true,
  isDisabled,
}) => {
  const isMobile = useMobile();
  const fieldArrayMethods = useFieldArray({
    name,
  });
  const data: TokensTableModel[] = fieldArrayMethods.fields.map(({ id }) => ({
    key: id,
  }));
  const { getFieldState } = useFormContext();
  const fieldState = getFieldState(name);
  const value = useWatch({ name }) || [];
  const columns = useTokensTableColumns(name, value);
  const getMenuProps = ({ index }) => {
    const shouldShow = shouldShowMenu(value[index]?.token);

    return shouldShow
      ? {
          cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
          items: [
            {
              key: 'remove',
              onClick: () => fieldArrayMethods.remove(index),
              label: formatText({ id: 'table.row.remove' }),
              icon: Trash,
            },
          ],
        }
      : undefined;
  };

  const { readonly } = useAdditionalFormOptionsContext();

  return (
    <div>
      <h5 className="text-2 mb-3 mt-6">
        {formatText({ id: 'actionSidebar.approvedTokens' })}
      </h5>
      {!!data.length && (
        <Table<TokensTableModel>
          className={clsx('mb-6', {
            '!border-negative-400': !!fieldState.error,
          })}
          getRowId={({ key }) => key}
          columns={columns}
          data={data}
          getMenuProps={getMenuProps}
        />
      )}
      {!readonly && (
        <Button
          mode="primaryOutline"
          icon={Plus}
          size="small"
          isFullSize={isMobile}
          onClick={() => {
            fieldArrayMethods.append({});
          }}
          disabled={isDisabled}
        >
          {formatText({ id: 'button.addToken' })}
        </Button>
      )}
    </div>
  );
};

TokensTable.displayName = displayName;

export default TokensTable;
