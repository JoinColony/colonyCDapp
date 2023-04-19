import React, { PropsWithChildren } from 'react';
import { FormattedMessage } from 'react-intl';

// import Link from '~shared/Link/Link';
import { LinkItemProps } from './types';
import styles from './LinkItem.module.css';

const displayName = 'Extensions.SubNavigation.LinkItem';

const LinkItem: React.FC<PropsWithChildren<LinkItemProps>> = ({ title, description }) => {
  return (
    <li className={styles.itemWrapper}>
      {/* <Link to="/"> */}
      <div className="text-gray-900 font-semibold text-lg">
        <FormattedMessage {...title} />
      </div>
      <div className="text-gray-600 text-md mb-2">
        <FormattedMessage {...description} />
      </div>
      {/* </Link> */}
    </li>
  );
};

LinkItem.displayName = displayName;

export default LinkItem;
