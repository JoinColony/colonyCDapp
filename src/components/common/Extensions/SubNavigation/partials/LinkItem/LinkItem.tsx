import React, { PropsWithChildren, FC } from 'react';
import { FormattedMessage } from 'react-intl';

// import Link from '~shared/Link/Link';

import { LinkItemProps } from './types';
import styles from './LinkItem.module.css';

const displayName = 'common.Extensions.SubNavigation.partials.LinkItem';

const LinkItem: FC<PropsWithChildren<LinkItemProps>> = ({ title, description, statusBadge }) => {
  return (
    <li className={styles.itemWrapper}>
      {/* <Link to="/"> */}
      <div className={styles.title}>
        <FormattedMessage {...title} />
        {statusBadge}
      </div>
      <div className={styles.description}>
        <FormattedMessage {...description} />
      </div>
      {/* </Link> */}
    </li>
  );
};

LinkItem.displayName = displayName;

export default LinkItem;
