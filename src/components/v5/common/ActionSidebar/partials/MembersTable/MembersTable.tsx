import { Plus, Trash } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useEffect, type FC } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { useMobile } from '~hooks/index.ts';
import { type ManageVerifiedMembersOperation } from '~types';
import { formatText } from '~utils/intl.ts';
import { Table } from '~v5/common/Table/Table.tsx';
import Button from '~v5/shared/Button/Button.tsx';

import { useVerifiedMembersTableColumns } from './hooks.tsx';
import {
  type VerifiedMembersTableModel,
  type VerifiedMembersTableProps,
} from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.VerifiedMembersTable';

const VerifiedMembersTable: FC<VerifiedMembersTableProps> = ({ name }) => {
  const fieldArrayMethods = useFieldArray({
    name,
  });
  const data: VerifiedMembersTableModel[] = fieldArrayMethods.fields.map(
    ({ id }) => ({
      key: id,
    }),
  );
  const manageMembers: ManageVerifiedMembersOperation | undefined = useWatch({
    name: 'manageMembers',
  });
  const { getFieldState, getValues } = useFormContext();
  const { readonly } = useAdditionalFormOptionsContext();
  const isMobile = useMobile();
  const isEmptyData = getValues(name)?.[0]?.value === undefined;
  const getMenuProps = ({ index }) => {
    return !isEmptyData || data.length > 1
      ? {
          cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
          contentWrapperClassName: clsx({
            '!left-6 right-6': !isMobile,
          }),
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
  const columns = useVerifiedMembersTableColumns({
    name,
    fieldArrayMethods,
    manageMembers,
    getMenuProps,
  });

  const fieldState = getFieldState(name);

  useEffect(() => {
    if (data.length === 0) {
      fieldArrayMethods.append({});
    }
  }, [data.length, fieldArrayMethods]);

  return (
    <div>
      <h5 className="mb-3 mt-6 text-2">
        {formatText({ id: 'actionSidebar.manageMembers.table' })}
      </h5>
      <Table<VerifiedMembersTableModel>
        className={clsx({
          '!border-negative-400': !!fieldState.error,
        })}
        columns={columns}
        data={data}
        borders={{
          visible: true,
          type: 'unset',
        }}
        moreActions={{}}
        overrides={{
          getRowId: ({ key }) => key,
          initialState: {
            pagination: {
              pageIndex: 0,
              pageSize: 400,
            },
          },
        }}
      />
      {!readonly && (
        <Button
          mode="primaryOutline"
          icon={Plus}
          size="small"
          className="mt-6"
          isFullSize={isMobile}
          onClick={() => {
            fieldArrayMethods.append({});
          }}
        >
          <FormattedMessage id="button.addMember" />
        </Button>
      )}
    </div>
  );
};

VerifiedMembersTable.displayName = displayName;

export default VerifiedMembersTable;
