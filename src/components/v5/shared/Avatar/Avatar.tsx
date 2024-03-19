import { XCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, {
  type CSSProperties,
  type FC,
  type PropsWithChildren,
} from 'react';

import { tw } from '~utils/css/index.ts';

import getIcon from './identicon.ts';
import { type AvatarProps2, type AvatarProps } from './types.ts';

const displayName = 'v5.Avatar';

export const Avatar2: FC<AvatarProps2> = ({
  address,
  alt,
  className,
  size,
  src,
}) => {
  const source = src ?? getIcon(address.toLowerCase());

  return (
    <img
      className={clsx('rounded-full bg-cover', className)}
      src={source}
      alt={alt}
      style={{
        width: size,
        height: size,
        imageRendering: src ? undefined : 'pixelated',
      }}
    />
  );
};
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
  const mainClass = size ? sizeClasses[size] : sizeClasses.main;

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
            className={`h-full w-full ${notSet ? 'opacity-100' : 'opacity-50'}`}
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
