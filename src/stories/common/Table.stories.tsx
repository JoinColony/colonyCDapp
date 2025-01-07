import { Binoculars } from '@phosphor-icons/react';
import {
  createColumnHelper,
  getPaginationRowModel,
  type Row,
} from '@tanstack/react-table';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';

import EmptyContent from '~v5/common/EmptyContent/EmptyContent.tsx';
import { Table } from '~v5/common/Table/Table.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/MeatBallMenu.tsx';

import type { Meta, StoryObj } from '@storybook/react';

interface TestTableFieldModel {
  firstName: string;
  lastName: string;
}

const columnHelper = createColumnHelper<TestTableFieldModel>();

const meta: Meta<typeof Table<TestTableFieldModel>> = {
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

export default meta;
// type Story = StoryObj<typeof BaseTable>;

export const Base: StoryObj<typeof Table<TestTableFieldModel>> = {
  args: {
    pagination: {
      visible: true,
    },
  },
};

export const WithPaginatedContent: StoryObj<typeof Table<TestTableFieldModel>> =
  {
    args: {
      pagination: {
        visible: true,
      },
      overrides: {
        initialState: {
          pagination: {
            pageIndex: 0,
            pageSize: 1,
          },
        },
        getPaginationRowModel: getPaginationRowModel<TestTableFieldModel>(),
      },
    },
  };

export const VerticalLayout: StoryObj<typeof Table<TestTableFieldModel>> = {
  args: {
    ...Base.args,
    layout: 'vertical',
  },
};

const getMenuProps = () => ({
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
});

export const WithMenu: StoryObj<typeof Table<TestTableFieldModel>> = {
  args: {
    ...Base.args,
    columns: [
      ...(meta.args?.columns ?? []),
      columnHelper.display({
        id: 'menu',
        size: 60,
        minSize: 60,
        cell: () => {
          const props = getMenuProps();

          return props ? (
            <MeatBallMenu
              {...props}
              buttonClassName="ml-auto"
              contentWrapperClassName="!z-sidebar"
            />
          ) : undefined;
        },
      }),
    ],
    moreActions: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderMoreActions: (_: Row<TestTableFieldModel>) => {
        return (
          <MeatBallMenu
            {...getMenuProps()}
            buttonClassName="ml-auto"
            contentWrapperClassName={clsx(
              '!left-1 !right-6 !z-sidebar sm:!left-auto',
            )}
          />
        );
      },
    },
  },
};

export const VerticalLayoutWithMenu: StoryObj<
  typeof Table<TestTableFieldModel>
> = {
  args: {
    ...Base.args,
    ...VerticalLayout.args,
    ...WithMenu.args,
  },
};

export const WithAdditionalContent: StoryObj<
  typeof Table<TestTableFieldModel>
> = {
  args: {
    pagination: {
      visible: true,
      children: (
        <Link className="text-sm text-gray-700 underline" to="/">
          View all
        </Link>
      ),
    },
  },
};

export const WithEmptyContent: StoryObj<typeof Table<TestTableFieldModel>> = {
  args: {
    pagination: {
      visible: false,
    },
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
    ...Base.args,
    renderCellWrapper: (classNames, content) => (
      <div className={clsx(classNames, 'bg-gray-200 py-3.5')}>{content}</div>
    ),
  },
};
