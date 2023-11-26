import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { Star, Trash } from 'phosphor-react';
import { formatText } from '~utils/intl';
import { ColonyContributorFragment } from '~gql';
import MemberAvatar from '../MemberAvatar';
import Checkbox from '~v5/common/Checkbox';
import { ContributorTypeFilter } from '~v5/common/TableFiltering/types';
import UserStatusComponent from '~v5/shared/CardWithBios/partials/UserStatus';
import PermissionRow from '../PermissionRow';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey';

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
          <div className="hidden sm:flex items-center justify-end w-full text-gray-600">
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
              className="ml-auto flex items-center text-gray-600 hover:text-negative-400 transition-colors duration-normal"
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnHelper],
  );

  return columns;
};
