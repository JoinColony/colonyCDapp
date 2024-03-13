import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';

import Link from '../Link/index.ts';

import ButtonContent from './ButtonContent.tsx';
import { type ButtonLinkProps } from './types.ts';

import styles from './Button.module.css';

const displayName = 'v5.ButtonLink';

const ButtonLink: FC<PropsWithChildren<ButtonLinkProps>> = ({
  mode = 'primarySolid',
  size = 'default',
  children,
  disabled = false,
  loading = false,
  title,
  textValues,
  text,
  className,
  isFullRounded = false,
  isFullSize,
  icon,
  iconSize = 12,
  isIconRight,
  ...rest
}) => (
  <>
    {loading ? (
      <SpinnerLoader appearance={{ size: 'medium' }} />
    ) : (
      <Link
        className={clsx(
          'flex items-center justify-center font-medium transition-all duration-normal',
          `${isFullRounded ? 'rounded-full' : 'rounded-lg'}`,
          {
            'min-h-[2.5rem] px-4 py-2 text-md': size === 'default',
            'min-h-[2.5rem] px-[0.875rem] py-[0.625rem] text-md':
              size === 'large',
            '!rounded-[0.1875rem] px-2 py-1 capitalize text-4':
              size === 'extraSmall',
            'min-h-[2.125rem] px-3 py-2 text-sm': size === 'small',
            [styles.primarySolid]: mode === 'primarySolid',
            [styles.primaryOutline]: mode === 'primaryOutline',
            [styles.primaryOutlineFull]: mode === 'primaryOutlineFull',
            [styles.secondarySolid]: mode === 'secondarySolid',
            [styles.secondaryOutline]: mode === 'secondaryOutline',
            [styles.quinary]: mode === 'quinary',
            [styles.senary]: mode === 'senary',
            [styles.quaternary]: mode === 'quaternary',
            [styles.tertiary]: mode === 'tertiary' || size === 'large',
            [styles.septenary]: mode === 'septenary',
            [styles.completed]: mode === 'completed',
            'pointer-events-none': disabled || loading,
            'w-full': isFullSize,
            'border border-gray-300 !bg-base-white !text-gray-300':
              disabled && isIconRight,
          },
          className,
        )}
        aria-busy={loading}
        title={title}
        {...rest}
      >
        <ButtonContent
          mode={mode}
          icon={icon}
          iconSize={iconSize}
          isIconRight={isIconRight}
          textValues={textValues}
          text={text}
        >
          {children}
        </ButtonContent>
      </Link>
    )}
  </>
);

ButtonLink.displayName = displayName;

export default ButtonLink;
