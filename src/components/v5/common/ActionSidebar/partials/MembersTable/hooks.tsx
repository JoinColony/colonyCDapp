import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { type FieldValues, type UseFieldArrayReturn } from 'react-hook-form';

import { useMobile } from '~hooks';
import { ManageVerifiedMembersOperation } from '~types';
import { formatText } from '~utils/intl.ts';

import NonVerifiedMembersSelect from '../NonVerifiedMembersSelect/index.ts';
import VerifiedMembersSelect from '../VerifiedMembersSelect/index.ts';

import { type VerifiedMembersTableModel } from './types.ts';

export const useVerifiedMembersTableColumns = (
  name: string,
  fieldArrayMethods: UseFieldArrayReturn<FieldValues, string, 'id'>,
  manageMembers: ManageVerifiedMembersOperation | undefined,
): ColumnDef<VerifiedMembersTableModel, string>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<VerifiedMembersTableModel>(),
    [],
  );
  const isMobile = useMobile();

  const columns: ColumnDef<VerifiedMembersTableModel, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'member',
        staticSize: isMobile ? '6.125rem' : undefined,
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

  return columns;
};
