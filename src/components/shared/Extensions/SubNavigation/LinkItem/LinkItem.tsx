import React, { PropsWithChildren } from 'react';
import { FormattedMessage } from 'react-intl';

// import Link from '~shared/Link/Link';
import { LinkItemProps } from './types';
import styles from './LinkItem.module.css';

const displayName = 'Extensions.SubNavigation.LinkItem';

const LinkItem: React.FC<PropsWithChildren<LinkItemProps>> = ({ title, description, statusBadge }) => {
  return (
    <li className={styles.itemWrapper}>
      {/* <Link to="/"> */}
      <div className="text-gray-900 font-semibold text-lg flex justify-between mb-1">
        <FormattedMessage {...title} />
        {statusBadge}
      </div>
      <div className="text-gray-600 text-md mb-2 flex-wrap">
        <FormattedMessage {...description} />
      </div>
      {/* </Link> */}
    </li>
  );
};

LinkItem.displayName = displayName;

export default LinkItem;
