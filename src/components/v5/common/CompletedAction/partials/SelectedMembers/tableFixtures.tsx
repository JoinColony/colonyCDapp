import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import React from 'react';

import MaskedAddress from '~shared/MaskedAddress/MaskedAddress.tsx';
import { formatText } from '~utils/intl.ts';
import Avatar from '~v5/shared/Avatar/index.ts';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import { SelectedMemberType, type SelectedMember } from './types.ts';

export type MembersTableModel = SelectedMember;

const columnHelper = createColumnHelper<SelectedMember>();

export const membersColumns: ColumnDef<SelectedMember>[] = [
  columnHelper.display({
    id: 'members',
    header: () =>
      formatText({
        id: 'actionSidebar.manageVerifiedMembers.table.column.members',
      }),
    cellContentWrapperClassName: 'text-gray-900',
    cell: ({ row }) => {
      if (row.original.type === SelectedMemberType.USER) {
        const user = row.original.data;

        return (
          <UserPopover
            className="flex items-center text-md font-medium text-gray-900"
            userName={user.profile?.displayName ?? user.walletAddress}
            walletAddress={user.walletAddress}
            user={user}
            popperOptions={{
              placement: 'bottom-start',
            }}
          >
            <Avatar
              size="xs"
              avatar={user.profile?.avatar ?? undefined}
              seed={user.walletAddress.toLowerCase()}
            />
            <span className="ml-2">
              {user.profile?.displayName ?? user.walletAddress}
            </span>
          </UserPopover>
        );
      }

      const { walletAddress } = row.original.data;

      return (
        <UserPopover
          className="flex items-center text-gray-900"
          userName={walletAddress}
          walletAddress={walletAddress}
          popperOptions={{
            placement: 'bottom-start',
          }}
        >
          <Avatar size="xs" seed={walletAddress.toLowerCase()} />
          <MaskedAddress
            address={walletAddress}
            className="ml-2 !text-md !font-medium text-gray-900 hover:text-blue-400"
          />
        </UserPopover>
      );
    },
  }),
];
