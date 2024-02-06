import { List } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';

import { type HamburgerProps } from './types.ts';

const displayName = 'v5.Button.Hamburger';

const Hamburger: FC<HamburgerProps> = ({
  disabled = false,
  loading = false,
  title,
  type = 'button',
  ariaLabel,
  icon: Icon = List,
  iconSize = 12,
  setTriggerRef,
  isOpened,
  ...rest
}) => {
  const { formatMessage } = useIntl();

  const titleText =
    typeof title === 'string' ? title : title && formatMessage(title);

  const ariaLabelText =
    typeof ariaLabel === 'string'
      ? ariaLabel
      : ariaLabel && formatMessage(ariaLabel);

  return (
    <>
      {loading ? (
        <SpinnerLoader appearance={{ size: 'medium' }} />
      ) : (
        <button
          className={clsx(
            'relative flex items-center justify-center border transition-all duration-normal min-w-[2.625rem] min-h-[2.5rem] p-2.5 bg-base-white rounded-full disabled:text-gray-300 z-50 text-1 text-gray-700',
            {
              'pointer-events-none': disabled,
              'border-blue-400': isOpened,
              'border-gray-200 md:hover:border-blue-400': !isOpened,
            },
          )}
          disabled={disabled || loading}
          aria-label={ariaLabelText}
          aria-busy={loading}
          title={titleText}
          /* eslint-disable react/button-has-type */
          type={type}
          /* eslint-enable react/button-has-type */
          ref={setTriggerRef}
          {...rest}
        >
          {Icon && <Icon size={iconSize} />}
        </button>
      )}
    </>
  );
};

Hamburger.displayName = displayName;

export default Hamburger;
