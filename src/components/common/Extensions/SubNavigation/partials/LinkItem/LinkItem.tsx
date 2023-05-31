import React, { PropsWithChildren, FC } from 'react';
import { FormattedMessage } from 'react-intl';
// import Link from '~shared/Extensions/Link';
import { LinkItemProps } from './types';
import styles from './LinkItem.module.css';

const displayName = 'common.Extensions.SubNavigation.partials.LinkItem';

const LinkItem: FC<PropsWithChildren<LinkItemProps>> = ({ title, description, statusBadge }) => {
  return (
    <li className={styles.itemWrapper}>
      {/* <Link to="/"> */}
      <a className={styles.link} href="/">
        <span className={styles.title}>
          <FormattedMessage {...title} />
          <span className="ml-1 shrink-0">{statusBadge}</span>
        </span>
        <span className={styles.description}>
          <FormattedMessage {...description} />
        </span>
      </a>

      {/* </Link> */}
    </li>
  );
};

LinkItem.displayName = displayName;

export default LinkItem;
