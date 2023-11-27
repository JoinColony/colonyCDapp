import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { formatText } from '~utils/intl';
import Icon from '~shared/Icon';
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
        cell: ({ row }) => (
          <div className="flex items-center">
            <Checkbox
              isChecked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
            <MemberAvatar member={row.original} />
          </div>
        ),
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

            return <UserStatusComponent userStatus={userStatus} />;
          } catch {
            return null;
          }
        },
      }),
      columnHelper.accessor('colonyReputationPercentage', {
        header: () => formatText({ id: 'verifiedPage.table.reputation' }),
        cell: ({ row }) => (
          <div className="hidden sm:flex items-center">
            <Icon name="star" appearance={{ size: 'small' }} />
            <span className="ml-1 text-sm text-gray-600">
              {Number.isInteger(row.original.colonyReputationPercentage)
                ? row.original.colonyReputationPercentage
                : row.original.colonyReputationPercentage.toFixed(2)}
              %
            </span>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'reputation',
        header: () => formatText({ id: 'verifiedPage.table.permission' }),
        cell: ({ row }) => (
          <PermissionRow contributorAddress={row.original.contributorAddress} />
        ),
      }),
      columnHelper.display({
        id: 'remove',
        size: 60,
        cell: () => (
          <div className="flex">
            <button
              type="button"
              className="ml-auto flex items-center hover:text-negative-400 transition-colors duration-normal"
              aria-label={formatText({ id: 'ariaLabel.deleteMember' })}
              onClick={onDeleteClick}
            >
              <Icon name="trash" appearance={{ size: 'small' }} />
            </button>
          </div>
        ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnHelper],
  );

  return columns;
};
