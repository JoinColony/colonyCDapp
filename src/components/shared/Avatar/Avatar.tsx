import { XCircle, type Icon as PhosphorIcon } from '@phosphor-icons/react';
import React, { type CSSProperties, type ReactNode } from 'react';

import { tw } from '~utils/css/index.ts';
import { type AvatarSize } from '~v5/shared/Avatar/types.ts';

import getIcon from './identicon.ts';

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
  placeholderIcon?: PhosphorIcon;

  /** Avatar size (default is between `s` and `m`) */
  size?: AvatarSize;

  /** Title for a11y */
  title: string;
}

const displayName = 'Avatar';

const sizeClasses = {
  main: tw`relative h-[2.8125rem] w-[2.8125rem] rounded-full`,
  xxxs: tw`relative h-[1rem] w-[1rem] rounded-full`,
  xxs: tw`relative h-[1.125rem] w-[1.125rem] rounded-full`,
  xs: tw`relative h-[1.625rem] w-[1.625rem] rounded-full`,
  s: tw`relative h-[2.125rem] w-[2.125rem] rounded-full`,
  sm: tw`relative h-[2.25rem] w-[2.25rem] rounded-full`,
  m: tw`relative h-[3.75rem] w-[3.75rem] rounded-full`,
  l: tw`relative h-[7.5rem] w-[7.5rem] rounded-full`,
  xl: tw`relative h-[10rem] w-[10rem] rounded-full`,
};

const Avatar = ({
  seed,
  avatar,
  children,
  className,
  notSet,
  placeholderIcon: Icon = XCircle,
  size,
  title,
}: Props) => {
  const source = notSet ? null : avatar || getIcon(seed || title);
  const mainClass = size ? sizeClasses[size] : sizeClasses.main;
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
        // if using a blockie, do pixelated image scaling
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
          className="absolute left-0 top-0 h-full w-full rounded-full bg-cover"
          style={imageStyle}
        />
      ) : (
        <Icon
          className={`h-full w-full fill-gray-500 stroke-gray-500 stroke-[0.5] ${notSet ? 'opacity-10' : 'opacity-50'}`}
        >
          <title>{title}</title>
        </Icon>
      )}
    </figure>
  );
};

Avatar.displayName = displayName;

export default Avatar;
