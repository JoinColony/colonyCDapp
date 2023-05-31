import React, { CSSProperties, ReactNode } from 'react';

import getIcon from './identicon';
import Icon from '~shared/Icon';
import styles from './Avatar.module.css';

export interface Props {
  /** Seed phrase for blockies fallback (usually an address) */
  seed?: string;

  /** Avatar image (can be a base64 encoded string) */
  avatar?: string | null;

  /** If children are present, they will be rendered directly (for svg components) */
  children?: ReactNode;

  /** Extra className */
  className?: string;

  /** Avatars that are not set have a different placeholder */
  notSet?: boolean;

  /** Icon name to use for placeholder */
  placeholderIcon?: string;

  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxxs' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';

  /** Title for a11y */
  title: string;
}

const displayName = 'Avatar';

const Avatar = ({
  seed,
  avatar,
  children,
  className,
  notSet,
  placeholderIcon = 'circle-close',
  size,
  title,
}: Props) => {
  const source = notSet ? null : avatar || getIcon(seed || title);
  const mainClass = size ? styles[size] : styles.main;
  if (children) {
    return (
      <figure className={className ? `${mainClass} ${className}` : mainClass} title={title}>
        {children}
      </figure>
    );
  }

  const imageStyle: CSSProperties = source
    ? {
        backgroundImage: `url(${source})`,
        // if using a blockie, do pixelated image scaling
        imageRendering: avatar ? undefined : 'pixelated',
      }
    : {};
  return (
    <figure className={className ? `${mainClass} ${className}` : mainClass} title={title}>
      {source ? (
        <div className={styles.image} style={imageStyle} />
      ) : (
        <Icon
          className={notSet ? styles.placeholderIconNotSet : styles.placeholderIcon}
          name={placeholderIcon}
          title={title}
          data-test="avatar"
        />
      )}
    </figure>
  );
};

Avatar.displayName = displayName;

export default Avatar;
