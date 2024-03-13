import { XCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, {
  type CSSProperties,
  type FC,
  type PropsWithChildren,
} from 'react';

import getIcon from './identicon.ts';
import { type AvatarProps } from './types.ts';

import styles from './Avatar.module.css';

const displayName = 'v5.Avatar';

const Avatar: FC<PropsWithChildren<AvatarProps>> = ({
  seed,
  avatar,
  children,
  className,
  notSet,
  placeholderIcon: Icon = XCircle,
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
        className={clsx('h-full w-full rounded-full bg-cover', {
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
          >
            {title ? <title>{title}</title> : null}
          </Icon>
        )}
      </div>
    </figure>
  );
};

Avatar.displayName = displayName;

export default Avatar;
