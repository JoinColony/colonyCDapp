import React, { FC, useCallback, useState } from 'react';

import { ColonyRole } from '@colony/colony-js';
import { TableItemProps } from './types';
import { useColonyContext, useContributorBreakdown } from '~hooks';
import UserAvatarPopover from '~v5/shared/UserAvatarPopover';
import { splitWalletAddress } from '~utils/splitWalletAddress';
import Icon from '~shared/Icon';
import Checkbox from '~v5/common/Checkbox';
import { formatText } from '~utils/intl';
import { getRole } from '~constants/permissions';
import { getAllUserRoles } from '~transformers';
import PermissionsBadge from '~v5/common/Pills/PermissionsBadge';
import UserStatusComponent from '~v5/shared/CardWithBios/partials/UserStatus';
import { ContributorTypeFilter } from '~v5/common/TableFiltering/types';
import Tooltip from '~shared/Extensions/Tooltip';

const displayName = 'v5.pages.VerifiedPage.partials.TableItem';

const TableItem: FC<TableItemProps> = ({ member, onDeleteClick, onChange }) => {
  const { colony } = useColonyContext();
  const { user, colonyReputationPercentage, contributorAddress } = member || {};
  const { walletAddress = '', profile } = user || {};
  const { bio, displayName: name } = profile || {};

  const [isChecked, setIsChecked] = useState<boolean>();

  const handleChange = useCallback(
    (e) => {
      setIsChecked(e.target.checked);
      onChange(e);
    },
    [setIsChecked, onChange],
  );

  const { isVerified, type } = member ?? {};

  const domains = useContributorBreakdown(member);
  const allRoles = getAllUserRoles(colony, contributorAddress);
  const permissionRole = getRole(allRoles);

  const userStatus = (type?.toLowerCase() ?? null) as ContributorTypeFilter;

  return (
    <div
      className="grid grid-cols-[2fr_0.5fr_0.5fr] sm:grid-cols-[3fr_1fr_0.5fr_7rem_2rem]
    py-3 border-t border-gray-100 first:border-none gap-4"
    >
      <div className="flex items-center">
        <Checkbox
          id={`verified-${name}`}
          name={`verified-${name}`}
          isChecked={isChecked}
          onChange={(e) => handleChange(e)}
        />
        <div className="ml-1 flex">
          <UserAvatarPopover
            userName={name}
            walletAddress={splitWalletAddress(walletAddress || '')}
            aboutDescription={bio || ''}
            domains={domains}
            user={user}
            avatarSize="xs"
            isVerified={isVerified}
          />
        </div>
        <span className="ml-1 flex shrink-0 text-blue-400">
          <Icon name="verified" appearance={{ size: 'tiny' }} />
        </span>
      </div>
      <div className="hidden sm:flex items-center">
        {userStatus && <UserStatusComponent userStatus={userStatus} />}
      </div>
      <div className="hidden sm:flex items-center">
        <Icon name="star" appearance={{ size: 'small' }} />
        <span className="ml-1 text-sm text-gray-600">
          {Number.isInteger(colonyReputationPercentage)
            ? colonyReputationPercentage
            : colonyReputationPercentage.toFixed(2)}
          %
        </span>
      </div>
      <div className="flex items-center">
        <Tooltip
          tooltipContent={
            <>
              {formatText(
                { id: 'role.description' },
                { role: permissionRole.name },
              )}
              <ul className="list-disc font-medium pl-4 mb-4">
                {permissionRole.permissions.map((permission) => (
                  <li key={permission}>{ColonyRole[permission]}</li>
                ))}
              </ul>
              <a href="/">{formatText({ id: 'learn.more' })}</a>
            </>
          }
        >
          <PermissionsBadge iconName="user" text={permissionRole.name} />
        </Tooltip>
      </div>
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
    </div>
  );
};

TableItem.displayName = displayName;

export default TableItem;
