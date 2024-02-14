import clsx from 'clsx';
import React, { forwardRef, type PropsWithChildren } from 'react';

import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { formatText } from '~utils/intl.ts';

import ButtonContent from './ButtonContent.tsx';
import { type ButtonProps } from './types.ts';

import styles from './Button.module.css';

const displayName = 'v5.Button';

const Button = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>(
  (
    {
      mode = 'primarySolid',
      size = 'default',
      children,
      disabled = false,
      loading = false,
      title,
      text,
      textValues,
      type = 'button',
      className,
      isFullRounded = false,
      ariaLabel,
      isFullSize,
      icon,
      iconSize = 18,
      isIconRight,
      ...rest
    },
    ref,
  ) => {
    const titleText =
      typeof title === 'string' ? title : title && formatText(title);
    const ariaLabelText =
      typeof ariaLabel === 'string'
        ? ariaLabel
        : ariaLabel && formatText(ariaLabel);

    return (
      <>
        {loading ? (
          <SpinnerLoader appearance={{ size: 'medium' }} />
        ) : (
          <button
            className={clsx(
              'flex items-center justify-center font-medium transition-all duration-normal whitespace-nowrap',
              `${isFullRounded ? 'rounded-full' : 'rounded-lg'}`,
              {
                'text-md min-h-[2.5rem] px-4 py-2': size === 'default',
                'text-md min-h-[2.5rem] px-[0.875rem] py-[0.625rem]':
                  size === 'large',
                '!rounded-[0.1875rem] capitalize text-4 px-2 py-1':
                  size === 'extraSmall',
                'text-sm min-h-[2.125rem] px-3 py-2': size === 'medium',
                'text-sm min-h-[2.125rem] px-2.5 py-1.5': size === 'small',
                [styles.primarySolid]: mode === 'primarySolid',
                [styles.primarySolidFull]: mode === 'primarySolidFull',
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
                'pointer-events-none': disabled,
                'w-full': isFullSize,
                'bg-blue-400 text-base-white': mode === 'filled',
                'border border-gray-300 !text-gray-300 !bg-base-white':
                  disabled && isIconRight,
                'bg-base-white border border-gray-300 text-gray-700 sm:hover:bg-blue-400 sm:hover:text-base-white sm:hover:border-blue-400':
                  mode === 'notFilled',
                'rounded-full': isFullRounded,
                'rounded-lg': !isFullRounded,
              },
              className,
            )}
            disabled={disabled || loading}
            aria-label={ariaLabelText}
            aria-busy={loading}
            title={titleText}
            /* eslint-disable react/button-has-type */
            type={type}
            /* eslint-enable react/button-has-type */
            ref={ref}
            {...rest}
          >
            <ButtonContent
              mode={mode}
              icon={icon}
              iconSize={iconSize}
              isIconRight={isIconRight}
              text={text}
              textValues={textValues}
            >
              {children}
            </ButtonContent>
          </button>
        )}
      </>
    );
  },
);

Button.displayName = displayName;

export default Button;
