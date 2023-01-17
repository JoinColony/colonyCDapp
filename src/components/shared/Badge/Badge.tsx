import React from 'react';
import camelcase from 'camelcase';

import Avatar, { AvatarProps } from '~shared/Avatar';
import { badges } from '~images/icons.json';
import { Icons } from '~constants';

import styles from './Badge.css';

// @todo we should have typed badges / icon names
const badgeIcons = badges.reduce((badgeObj, badgeName) => {
  const id = camelcase(badgeName);
  return {
    ...badgeObj,
    // eslint-disable-next-line no-param-reassign, global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires
    [id]: require(`~images/badges/${id}.svg`).default,
  };
}, {});

interface Props {
  /** Name of the icon (camelCase) */
  name: string;
  /** Size of the icon */
  size?: AvatarProps['size'];
  /** HTML title attribute */
  title: string;
}

const displayName = 'Badge';

const Badge = ({ name, size = 'm', title }: Props) => {
  const BadgeIcon = badgeIcons[name];
  return (
    <Avatar
      className={styles.main}
      placeholderIcon={Icons.QuestionMark}
      size={size}
      title={title}
    >
      <BadgeIcon />
    </Avatar>
  );
};

Badge.displayName = displayName;

export default Badge;
