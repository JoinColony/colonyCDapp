import clsx from 'clsx';
import React, { FC } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import { useMobile } from '~hooks';
import { formatText } from '~utils/intl';
import TableWithMeatballMenu from '~v5/common/TableWithMeatballMenu';
import Button from '~v5/shared/Button';

import {
  useGetTableMenuProps,
  useRenderCell,
  useTokensTableColumns,
} from './hooks';
import { TokensTableModel, TokensTableProps } from './types';

const displayName = 'v5.common.ActionsContent.partials.TokensTable';

const TokensTable: FC<TokensTableProps> = ({
  name,
  shouldShowMenu = () => true,
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
  const getMenuProps = useGetTableMenuProps(
    fieldArrayMethods,
    value,
    shouldShowMenu,
  );
  const { readonly } = useAdditionalFormOptionsContext();
  const renderCell = useRenderCell();

  return (
    <div>
      <h5 className="text-2 mb-3 mt-6">
        {formatText({ id: 'actionSidebar.approvedTokens' })}
      </h5>
      {!!data.length && (
        <TableWithMeatballMenu<TokensTableModel>
          className={clsx(
            'mb-6 [&_th]:align-top [&_td]:py-2 [&_tr:nth-child(2)_th]:pt-2 [&_tr:nth-child(2)_td]:pt-0 sm:[&_td]:py-0 sm:[&_th]:align-middle sm:[&_td>div]:py-4',
            {
              '!border-negative-400': !!fieldState.error,
            },
          )}
          getRowId={({ key }) => key}
          columns={columns}
          data={data}
          getMenuProps={getMenuProps}
          renderCellWrapper={renderCell}
          meatBallMenuSize={42}
        />
      )}
      {!readonly && (
        <Button
          mode="primaryOutline"
          iconName="plus"
          size="small"
          isFullSize={isMobile}
          onClick={() => {
            fieldArrayMethods.append({
              isNew: true,
            });
          }}
        >
          {formatText({ id: 'button.addToken' })}
        </Button>
      )}
    </div>
  );
};

TokensTable.displayName = displayName;

export default TokensTable;
