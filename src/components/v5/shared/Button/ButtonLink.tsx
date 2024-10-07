import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';

import Link from '../Link/index.ts';

import buttonClasses from './Button.styles.ts';
import ButtonContent from './ButtonContent.tsx';
import { type ButtonLinkProps } from './types.ts';

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
            'min-h-10 px-4 py-2 text-md': size === 'default',
            'min-h-10 px-[0.875rem] py-[0.625rem] text-md': size === 'large',
            '!rounded-[0.1875rem] px-2 py-1 capitalize text-4':
              size === 'extraSmall',
            'min-h-8.5 px-3 py-2 text-sm': size === 'small',
            [buttonClasses.primarySolid]: mode === 'primarySolid',
            [buttonClasses.primarySolid]: mode === 'primarySolid',
            [buttonClasses.primaryOutline]: mode === 'primaryOutline',
            [buttonClasses.primaryOutlineFull]: mode === 'primaryOutlineFull',
            [buttonClasses.secondarySolid]: mode === 'secondarySolid',
            [buttonClasses.secondaryOutline]: mode === 'secondaryOutline',
            [buttonClasses.tertiary]: mode === 'tertiary' || size === 'large',
            [buttonClasses.quaternary]: mode === 'quaternary',
            [buttonClasses.quinary]: mode === 'quinary',
            [buttonClasses.senary]: mode === 'senary',
            [buttonClasses.septenary]: mode === 'septenary',
            [buttonClasses.completed]: mode === 'completed',
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
