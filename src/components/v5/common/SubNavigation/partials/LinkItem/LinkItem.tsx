import clsx from 'clsx';
import React, { PropsWithChildren, FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { LinkItemProps } from './types';

import styles from './LinkItem.module.css';

const displayName = 'v5.common.SubNavigation.partials.LinkItem';

const LinkItem: FC<PropsWithChildren<LinkItemProps>> = ({
  title,
  description,
  statusBadge,
  onClick,
}) => (
  <li className={styles.itemWrapper}>
    <button type="button" className={styles.link} onClick={onClick}>
      <span className={clsx(styles.title, 'heading-5')}>
        <FormattedMessage {...title} />
        <span className="ml-1 shrink-0">{statusBadge}</span>
      </span>
      <span className={styles.description}>
        <FormattedMessage {...description} />
      </span>
    </button>
  </li>
);
LinkItem.displayName = displayName;

export default LinkItem;
