/* eslint-disable react/button-has-type */
import React, { forwardRef, PropsWithChildren } from 'react';
import clsx from 'clsx';

import { ButtonProps } from './types';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader';
import styles from './Button.module.css';
import ButtonContent from './ButtonContent';
import { formatText } from '~utils/intl';

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
      iconName,
      iconSize = 'tiny',
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
              'flex items-center justify-center font-medium transition-all duration-normal',
              {
                'text-md min-h-[2.5rem] px-4 py-2': size === 'default',
                'text-md min-h-[2.5rem] px-[0.875rem] py-[0.625rem]':
                  size === 'large',
                '!rounded-[0.1875rem] capitalize text-4 px-2 py-1':
                  size === 'extraSmall',
                'text-sm min-h-[2.125rem] px-3 py-2': size === 'small',
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
                'pointer-events-none': disabled,
                'w-full': isFullSize,
                'border border-gray-300 !text-gray-300 !bg-base-white':
                  disabled && isIconRight,
                'rounded-full': isFullRounded,
                'rounded-lg': !isFullRounded,
              },
              className,
            )}
            disabled={disabled || loading}
            aria-label={ariaLabelText}
            aria-busy={loading}
            title={titleText}
            type={type}
            ref={ref}
            {...rest}
          >
            <ButtonContent
              mode={mode}
              iconName={iconName}
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

export default Object.assign(Button, { displayName });
