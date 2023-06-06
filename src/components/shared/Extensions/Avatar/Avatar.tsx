import React, { CSSProperties, FC, PropsWithChildren } from 'react';

import getIcon from './identicon';
import styles from './Avatar.module.css';
import Icon from '~shared/Icon';
import { AvatarProps } from './types';

const displayName = 'Extensions.Avatar';

const Avatar: FC<PropsWithChildren<AvatarProps>> = ({
  seed,
  avatar,
  children,
  className,
  notSet,
  placeholderIcon = 'circle-close',
  size = 'xs',
  title = '',
}) => {
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
