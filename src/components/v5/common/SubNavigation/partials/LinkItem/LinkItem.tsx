import React, { PropsWithChildren, FC } from 'react';
import { FormattedMessage } from 'react-intl';
import clsx from 'clsx';

import { LinkItemProps } from './types';
import styles from './LinkItem.module.css';
import Link from '~v5/shared/Link';

const displayName = 'v5.common.SubNavigation.partials.LinkItem';

const LinkItem: FC<PropsWithChildren<LinkItemProps>> = ({
  title,
  description,
  statusBadge,
}) => (
  <li className={styles.itemWrapper}>
    <Link to="/" className={styles.link}>
      <span className={clsx(styles.title, 'heading-5')}>
        <FormattedMessage {...title} />
        <span className="ml-1 shrink-0">{statusBadge}</span>
      </span>
      <span className={styles.description}>
        <FormattedMessage {...description} />
      </span>
    </Link>
  </li>
);
LinkItem.displayName = displayName;

export default LinkItem;
