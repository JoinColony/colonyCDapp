import { SpinnerGap } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import IconButton from '~v5/shared/Button/IconButton.tsx';
import Button from '~v5/shared/Button/index.ts';
import { type ButtonProps } from '~v5/shared/Button/types.ts';

export const ButtonWithLoader: FC<
  ButtonProps & {
    loaderClassName?: string;
    loaderIconSize?: number;
  }
> = ({
  loading,
  isFullSize,
  mode,
  disabled,
  children,
  type,
  size,
  loaderClassName = '!px-4 !text-md',
  loaderIconSize = 18,
  onClick,
  className,
}) =>
  loading ? (
    <IconButton
      rounded="s"
      isFullSize={isFullSize}
      text={{ id: 'button.pending' }}
      icon={
        <span className="ml-2 flex shrink-0">
          <SpinnerGap size={loaderIconSize} className="animate-spin" />
        </span>
      }
      className={loaderClassName}
    />
  ) : (
    <Button
      mode={mode}
      type={type}
      size={size}
      disabled={disabled}
      isFullSize={isFullSize}
      onClick={onClick}
      className={className}
    >
      {children}
    </Button>
  );
