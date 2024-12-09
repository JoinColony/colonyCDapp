import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import React from 'react';

import MaskedAddress from '~shared/MaskedAddress/MaskedAddress.tsx';
import { formatText } from '~utils/intl.ts';
import Avatar from '~v5/shared/Avatar/index.ts';
import UserAvatar from '~v5/shared/UserAvatar/UserAvatar.tsx';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

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
          <UserInfoPopover
            className="flex items-center text-md font-medium text-gray-900"
            walletAddress={user.walletAddress}
            user={user}
          >
            <UserAvatar
              size={20}
              userAvatarSrc={user.profile?.avatar ?? undefined}
              userAddress={user.walletAddress}
            />
            <span className="ml-2">
              {user.profile?.displayName ?? user.walletAddress}
            </span>
          </UserInfoPopover>
        );
      }

      const { walletAddress } = row.original.data;

      return (
        <UserInfoPopover
          className="flex items-center text-gray-900"
          walletAddress={walletAddress}
        >
          <Avatar size={20} address={walletAddress} />
          <MaskedAddress
            address={walletAddress}
            className="ml-2 !text-md !font-medium text-gray-900 hover:text-blue-400"
          />
        </UserInfoPopover>
      );
    },
  }),
];
