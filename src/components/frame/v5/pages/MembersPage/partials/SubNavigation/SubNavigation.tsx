import React from 'react';
import { useIntl } from 'react-intl';

import Tooltip from '~shared/Extensions/Tooltip';
import Icon from '~shared/Icon';
import { useMembersSubNavigation } from './hooks';
import styles from './SubNavigation.module.css';

const SubNavigation = () => {
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
            <span className="text-md ml-2">Invite members</span>
          </Tooltip>
        </button>
      </li>
      <li>
        <button type="button" className={styles.navigationButton}>
          <Icon name="lock-key" appearance={{ size: 'small' }} />
          <span className="text-md ml-2">Edit permissions</span>
        </button>
      </li>
      <li>
        <button type="button" className={styles.navigationButton}>
          <Icon name="pencil" appearance={{ size: 'small' }} />
          <span className="text-md ml-2">Manage members</span>
        </button>
      </li>
      <li>
        <button type="button" className={styles.navigationButton}>
          <Icon name="address-book" appearance={{ size: 'small' }} />
          <span className="text-md ml-2">Manage verified</span>
        </button>
      </li>
    </ul>
  );
};

export default SubNavigation;
