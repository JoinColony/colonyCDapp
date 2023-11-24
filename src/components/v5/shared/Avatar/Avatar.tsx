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
  const source = notSet ? null : avatar || getIcon(seed || title || '');
  const mainClass = size ? styles[size] : styles.main;

  if (children) {
    return (
      <figure className={clsx(className, mainClass)} title={title ?? undefined}>
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
    <figure className={clsx(className, mainClass)} title={title ?? undefined}>
      <div
        className={clsx('w-full h-full rounded-full bg-cover', {
          'border-purple-400': mode === 'top',
          'border-warning-400': mode === 'active',
          'border-blue-400': mode === 'dedicated',
          'border-success-400': mode === 'new',
          'border-2': mode !== 'general',
        })}
        style={source ? imageStyle : undefined}
      >
        {!source && (
          <Icon
            className={
              notSet ? styles.placeholderIconNotSet : styles.placeholderIcon
            }
            name={placeholderIcon}
            title={title ?? undefined}
            data-test="avatar"
          />
        )}
      </div>
    </figure>
  );
};

Avatar.displayName = displayName;

export default Avatar;
