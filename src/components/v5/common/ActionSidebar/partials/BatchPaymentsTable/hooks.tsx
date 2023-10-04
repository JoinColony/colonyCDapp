import { useCallback, useMemo, useState } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { FileRejection } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { formatText } from '~utils/intl';
import { BatchPaymentsTableModel } from './types';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';
import { FileReaderFile } from '~utils/fileReader/types';
import { DropzoneErrors } from '~shared/AvatarUploader/helpers';
import { getFileRejectionErrors } from '~shared/FileUpload/utils';
import getFileReader from '~utils/fileReader';
import useDropzoneWithFileReader from '~hooks/useDropzoneWithFileReader';

export const useBatchPaymentsTableColumns = (
  name: string,
): ColumnDef<BatchPaymentsTableModel, string>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<BatchPaymentsTableModel>(),
    [],
  );

  const columns: ColumnDef<BatchPaymentsTableModel, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'recipient',
        header: () => formatText({ id: 'table.row.recipient' }),
        cell: () => {
          // @TODO: display data
        },
      }),
      columnHelper.display({
        id: 'amount',
        header: () => formatText({ id: 'table.row.amount' }),
        cell: () => {
          // @TODO: display data
        },
      }),
      columnHelper.display({
        id: 'token',
        header: () => formatText({ id: 'table.row.token' }),
        cell: () => {
          // @TODO: display data
        },
      }),
    ],
    [columnHelper, name],
  );

  return columns;
};

export const useGetTableMenuProps = ({ remove }) =>
  useCallback<
    TableWithMeatballMenuProps<BatchPaymentsTableModel>['getMenuProps']
  >(
    ({ index }) => ({
      cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
      items: [
        {
          key: 'remove',
          onClick: () => remove(index),
          label: formatText({ id: 'table.row.remove' }),
          iconName: 'trash',
        },
      ],
    }),
    [remove],
  );
