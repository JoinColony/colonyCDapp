import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Icon from '~shared/Icon';
import styles from './FilterOptions.module.css';

const displayName = 'v5.common.Filter.partials.FilterOptions';

const FilterOptions: FC = () => {
  const { formatMessage } = useIntl();
  // @TODO: add conditions when filters should be visible / not visible
  // @TODO: add submenu

  return (
    <div>
      <span className="text-xs font-medium text-gray-400 mb-1 ml-[1.2rem] uppercase">
        {formatMessage({ id: 'filters' })}
      </span>
      <ul className="flex flex-col">
        <li className={styles.li}>
          <Icon name="users-three" appearance={{ size: 'tiny' }} />
          {formatMessage({ id: 'filter.teams' })}
        </li>
        <li className={styles.li}>
          <Icon name="user" appearance={{ size: 'tiny' }} />
          {formatMessage({ id: 'filter.contributor.type' })}
        </li>
        <li className={styles.li}>
          <Icon name="flag" appearance={{ size: 'tiny' }} />
          {formatMessage({ id: 'filter.user.status' })}
        </li>
        <li className={styles.li}>
          <Icon name="star-not-filled" appearance={{ size: 'tiny' }} />
          {formatMessage({ id: 'filter.reputation' })}
        </li>
        <li className={styles.li}>
          <Icon name="lock-key" appearance={{ size: 'tiny' }} />
          {formatMessage({ id: 'filter.permissions' })}
        </li>
      </ul>
    </div>
  );
};

FilterOptions.displayName = displayName;

export default FilterOptions;
