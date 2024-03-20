import { XCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, {
  type CSSProperties,
  type FC,
  type PropsWithChildren,
} from 'react';

import { tw } from '~utils/css/index.ts';

import getIcon from './identicon.ts';
import { type AvatarProps } from './types.ts';

const displayName = 'v5.Avatar';

const sizeClasses = {
  main: tw`relative inline-block h-[2.8125rem] w-[2.8125rem]`,
  xxs: tw`relative inline-block h-[1rem] w-[1rem]`,
  xss: tw`relative inline-block h-[1.125rem] w-[1.125rem]`,
  xs: tw`relative inline-block h-[1.25rem] w-[1.25rem]`,
  xxsm: tw`relative inline-block h-[1.5rem] w-[1.5rem]`,
  xsm: tw`relative inline-block h-[1.625rem] w-[1.625rem]`,
  smx: tw`relative flex h-[1.75rem] w-[1.75rem] items-center`,
  sm: tw`relative flex h-[1.875rem] w-[1.875rem] items-center`,
  s: tw`relative flex h-[2.125rem] w-[2.125rem] items-center`,
  xms: tw`relative inline-block h-[2.375rem] w-[2.375rem]`,
  ms: tw`relative inline-block h-[2.75rem] w-[2.75rem]`,
  xm: tw`relative inline-block h-16 w-16`,
  m: tw`relative inline-block h-[3.75rem] w-[3.75rem]`,
  md: tw`relative inline-block h-[5.625rem] w-[5.625rem]`,
  l: tw`relative inline-block h-[7.5rem] w-[7.5rem]`,
  xl: tw`relative inline-block h-[10rem] w-[10rem]`,
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
