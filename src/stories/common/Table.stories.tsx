import { Binoculars } from '@phosphor-icons/react';
import {
  createColumnHelper,
  getPaginationRowModel,
} from '@tanstack/react-table';
import clsx from 'clsx';
import React from 'react';

import EmptyContent from '~v5/common/EmptyContent/index.ts';
import Table from '~v5/common/Table/index.ts';
import Link from '~v5/shared/Link/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

interface TestTableFieldModel {
  firstName: string;
  lastName: string;
}

const columnHelper = createColumnHelper<TestTableFieldModel>();

const tableMeta: Meta<typeof Table<TestTableFieldModel>> = {
  title: 'Common/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  args: {
    columns: [
      columnHelper.display({
        id: 'firstName',
        header: 'First Name',
        cell: ({ row }) => row.original.firstName,
      }),
      columnHelper.display({
        id: 'lastName',
        header: 'Last Name',
        cell: ({ row }) => row.original.lastName,
      }),
    ],
    data: [
      {
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
      },
      {
        firstName: 'John',
        lastName: 'Smith',
      },
    ],
  },
};

export default tableMeta;

export const Base: StoryObj<typeof Table<TestTableFieldModel>> = {};

export const VerticalLayout: StoryObj<typeof Table<TestTableFieldModel>> = {
  args: {
    verticalLayout: true,
  },
};

export const WithMenu: StoryObj<typeof Table<TestTableFieldModel>> = {
  args: {
    getMenuProps: () => ({
      items: [
        {
          key: 'edit',
          label: 'Edit',
          // eslint-disable-next-line no-alert
          onClick: () => alert('Edit'),
        },
        {
          key: 'delete',
          label: 'Delete',
          // eslint-disable-next-line no-alert
          onClick: () => alert('Delete'),
        },
      ],
    }),
  },
};

export const VerticalLayoutWithMenu: StoryObj<
  typeof Table<TestTableFieldModel>
> = {
  args: {
    ...VerticalLayout.args,
    ...WithMenu.args,
  },
};

export const WithPagination: StoryObj<typeof Table<TestTableFieldModel>> = {
  args: {
    initialState: {
      pagination: {
        pageSize: 1,
      },
    },
    getPaginationRowModel: getPaginationRowModel<TestTableFieldModel>(),
  },
};

export const WithAdditionalContent: StoryObj<
  typeof Table<TestTableFieldModel>
> = {
  args: {
    ...WithPagination.args,
    additionalPaginationButtonsContent: (
      <Link className="text-sm text-gray-700 underline" to="/">
        View all
      </Link>
    ),
  },
};

export const WithEmptyContent: StoryObj<typeof Table<TestTableFieldModel>> = {
  args: {
    data: [],
    emptyContent: (
      <EmptyContent
        icon={Binoculars}
        title={{ id: 'balancePage.table.emptyTitle' }}
        description={{ id: 'balancePage.table.emptyDescription' }}
        withoutButtonIcon
        className="px-6 pb-9 pt-10"
      />
    ),
  },
};

export const WithCustomCellWrapper: StoryObj<
  typeof Table<TestTableFieldModel>
> = {
  args: {
    renderCellWrapper: (classNames, content) => (
      <div className={clsx(classNames, 'bg-gray-200 py-3.5')}>{content}</div>
    ),
  },
};
