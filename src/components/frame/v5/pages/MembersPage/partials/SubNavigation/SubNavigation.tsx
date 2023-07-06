import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Tooltip from '~shared/Extensions/Tooltip';
import Icon from '~shared/Icon';
import { useMembersSubNavigation } from './hooks';
import styles from './SubNavigation.module.css';

const displayName = 'pages.MembersPage.partials.SubNavigation';

const SubNavigation: FC = () => {
  const { handleClick, isCopyTriggered } = useMembersSubNavigation();
  const { formatMessage } = useIntl();

  return (
    <ul>
      <li>
        <button
          type="button"
          onClick={handleClick}
          className={styles.navigationButton}
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
            <Icon name="share-network" appearance={{ size: 'small' }} />
            <span className="text-md ml-2">
              {formatMessage({ id: 'members.subnav.invite' })}
            </span>
          </Tooltip>
        </button>
      </li>
      <li>
        <button type="button" className={styles.navigationButton}>
          <Icon name="lock-key" appearance={{ size: 'small' }} />
          <span className="text-md ml-2">
            {formatMessage({ id: 'members.subnav.permissions' })}
          </span>
        </button>
      </li>
      <li>
        <button type="button" className={styles.navigationButton}>
          <Icon name="pencil" appearance={{ size: 'small' }} />
          <span className="text-md ml-2">
            {formatMessage({ id: 'members.subnav.manage' })}
          </span>
        </button>
      </li>
      <li>
        <button type="button" className={styles.navigationButton}>
          <Icon name="address-book" appearance={{ size: 'small' }} />
          <span className="text-md ml-2">
            {formatMessage({ id: 'members.subnav.verified' })}
          </span>
        </button>
      </li>
    </ul>
  );
};

SubNavigation.displayName = displayName;

export default SubNavigation;
