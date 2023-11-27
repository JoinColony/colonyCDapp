import React, { CSSProperties, FC, PropsWithChildren } from 'react';

import clsx from 'clsx';
import getIcon from './identicon';
import styles from './Avatar.module.css';
import Icon from '~shared/Icon';
import { AvatarProps } from './types';

const displayName = 'v5.Avatar';

const Avatar: FC<PropsWithChildren<AvatarProps>> = ({
  seed,
  avatar,
  children,
  className,
  notSet,
  placeholderIcon = 'circle-close',
  size = 'xs',
  title,
  mode = 'general',
}) => {
  // eslint-disable-next-line no-param-reassign
  title = title ?? '';
  const source = notSet ? null : avatar || getIcon(seed || title);
  const mainClass = size ? styles[size] : styles.main;

  if (children) {
    return (
      <figure
        className={className ? `${mainClass} ${className}` : mainClass}
        title={title}
      >
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
    <figure
      className={className ? `${mainClass} ${className}` : mainClass}
      title={title}
    >
      {source ? (
        <div
          className={clsx('w-full h-full rounded-full bg-cover border-2', {
            'border-purple-400': mode === 'top',
            'border-warning-400': mode === 'active',
            'border-blue-400': mode === 'dedicated',
            'border-green-400': mode === 'new',
            'border-none': mode === 'general',
          })}
          style={imageStyle}
        />
      ) : (
        <Icon
          className={
            notSet ? styles.placeholderIconNotSet : styles.placeholderIcon
          }
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
