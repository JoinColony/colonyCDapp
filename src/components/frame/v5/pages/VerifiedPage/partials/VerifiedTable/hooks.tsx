import { Star, Trash } from '@phosphor-icons/react';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { type ColonyContributorFragment } from '~gql';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';
import { ContributorTypeFilter } from '~v5/common/TableFiltering/types.ts';
import UserStatusComponent from '~v5/shared/CardWithBios/partials/UserStatus.tsx';

import MemberAvatar from '../MemberAvatar/index.ts';
import PermissionRow from '../PermissionRow/index.ts';

export const useVerifiedTableColumns = (): ColumnDef<
  ColonyContributorFragment,
  string
>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<ColonyContributorFragment>(),
    [],
  );
  const onDeleteClick = () => {};

  const columns: ColumnDef<ColonyContributorFragment, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'member',
        header: () => formatText({ id: 'verifiedPage.table.member' }),
        cell: ({ row }) => {
          return (
            <div className="flex items-center">
              <Checkbox
                isChecked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
              />
              <MemberAvatar member={row.original} />
            </div>
          );
        },
      }),
      columnHelper.display({
        id: 'status',
        header: () => (
          <div className="hidden sm:block">
            {formatText({ id: 'verifiedPage.table.status' })}
          </div>
        ),
        cell: ({ row }) => {
          const { type } = row.original;

          try {
            const userStatus = getEnumValueFromKey(
              ContributorTypeFilter,
              type?.toLowerCase() || undefined,
            );

            if (userStatus === ContributorTypeFilter.General) {
              return null;
            }

            return (
              <UserStatusComponent userStatus={userStatus} pillSize="medium" />
            );
          } catch {
            return null;
          }
        },
        size: 130,
      }),
      columnHelper.accessor('colonyReputationPercentage', {
        id: 'reputation',
        header: () => formatText({ id: 'verifiedPage.table.reputation' }),
        cell: ({ row }) => (
          <div className="hidden w-full items-center justify-end text-gray-600 sm:flex">
            <Star size={18} />
            <span className="ml-1 text-sm">
              {Number.isInteger(row.original.colonyReputationPercentage)
                ? row.original.colonyReputationPercentage
                : row.original.colonyReputationPercentage.toFixed(2)}
              %
            </span>
          </div>
        ),
        size: 120,
      }),
      columnHelper.display({
        id: 'permission',
        header: () => formatText({ id: 'verifiedPage.table.permission' }),
        cell: ({ row }) => (
          <PermissionRow contributorAddress={row.original.contributorAddress} />
        ),
        size: 110,
      }),
      columnHelper.display({
        id: 'remove',
        cell: () => (
          <div className="flex">
            <button
              type="button"
              className="ml-auto flex items-center text-gray-600 transition-colors duration-normal hover:text-negative-400"
              aria-label={formatText({ id: 'ariaLabel.deleteMember' })}
              onClick={onDeleteClick}
            >
              <Trash size={18} />
            </button>
          </div>
        ),
        size: 60,
      }),
    ],

    [columnHelper],
  );

  return columns;
};
