import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Tooltip from '~shared/Extensions/Tooltip';
import { useMembersSubNavigation } from './hooks';
import { SubNavigationProps } from './types';
import Button from '~v5/shared/Button';

const displayName = 'v5.pages.MembersPage.partials.SubNavigation';

const SubNavigation: FC<SubNavigationProps> = ({ onManageMembersClick }) => {
  const { handleClick, isCopyTriggered } = useMembersSubNavigation();
  const { formatMessage } = useIntl();

  return (
    <ul>
      <li>
        <Button
          mode="senary"
          iconName="share-network"
          iconSize="small"
          onClick={handleClick}
        >
          <Tooltip
            tooltipContent={
              <span className="text-3 underline">
                {formatMessage({
                  id: isCopyTriggered ? 'copiedColony' : 'copyColony',
                })}
              </span>
            }
            isSuccess={isCopyTriggered}
          >
            <span className="text-md">
              {formatMessage({ id: 'members.subnav.invite' })}
            </span>
          </Tooltip>
        </Button>
      </li>
      <li>
        <Button mode="senary" iconName="lock-key" iconSize="small">
          <span className="text-md">
            {formatMessage({ id: 'members.subnav.permissions' })}
          </span>
        </Button>
      </li>
      <li>
        <Button
          mode="senary"
          onClick={onManageMembersClick}
          iconName="pencil"
          iconSize="small"
        >
          <span className="text-md">
            {formatMessage({ id: 'members.subnav.manage' })}
          </span>
        </Button>
      </li>
      <li>
        <Button mode="senary" iconName="address-book" iconSize="small">
          <span className="text-md">
            {formatMessage({ id: 'members.subnav.verified' })}
          </span>
        </Button>
      </li>
    </ul>
  );
};

SubNavigation.displayName = displayName;

export default SubNavigation;
