import {
  createColumnHelper,
  type Row,
  type ColumnDef,
} from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { type FieldValues, type UseFieldArrayReturn } from 'react-hook-form';

import { useMobile } from '~hooks';
import { ManageVerifiedMembersOperation } from '~types';
import { formatText } from '~utils/intl.ts';
import { makeMenuColumn } from '~v5/common/Table/utils.tsx';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

import NonVerifiedMembersSelect from '../NonVerifiedMembersSelect/index.ts';
import VerifiedMembersSelect from '../VerifiedMembersSelect/index.ts';

import { type VerifiedMembersTableModel } from './types.ts';

export const useVerifiedMembersTableColumns = ({
  name,
  fieldArrayMethods,
  manageMembers,
  getMenuProps,
}: {
  name: string;
  fieldArrayMethods: UseFieldArrayReturn<FieldValues, string, 'id'>;
  manageMembers: ManageVerifiedMembersOperation | undefined;
  getMenuProps: (
    row: Row<VerifiedMembersTableModel>,
  ) => MeatBallMenuProps | undefined;
}): ColumnDef<VerifiedMembersTableModel, string>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<VerifiedMembersTableModel>(),
    [],
  );
  const isMobile = useMobile();

  const menuColumn: ColumnDef<VerifiedMembersTableModel, string> = useMemo(
    () =>
      makeMenuColumn({
        helper: columnHelper,
        getMenuProps,
      }),
    [columnHelper, getMenuProps],
  );

  const columns: ColumnDef<VerifiedMembersTableModel, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'member',
        header: () => formatText({ id: 'table.row.member' }),
        cell: ({ row }) =>
          manageMembers === ManageVerifiedMembersOperation.Add ? (
            <NonVerifiedMembersSelect
              fieldArrayMethods={fieldArrayMethods}
              name={`${name}.${row.index}`}
            />
          ) : (
            <VerifiedMembersSelect
              fieldArrayMethods={fieldArrayMethods}
              name={`${name}.${row.index}`}
            />
          ),
      }),
    ],
    // Disabling this line because if we leave fieldArrayMethods then selects rerenders on every change not allowing to select multiple choices
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnHelper, name, isMobile, manageMembers],
  );

  return menuColumn ? [...columns, menuColumn] : columns;
};
