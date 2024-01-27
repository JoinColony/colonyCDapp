import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import { DotButtonProps } from '../types.ts';

const displayName = 'common.Extensions.ImageCarousel.partials.DotButton';

const DotButton: FC<PropsWithChildren<DotButtonProps>> = ({
  children,
  ...props
}) => {
  const { formatMessage } = useIntl();

  return (
    <button
      type="button"
      aria-label={formatMessage({ id: 'ariaLabel.changeSlide' })}
      {...props}
    >
      {children}
    </button>
  );
};

DotButton.displayName = displayName;

export default DotButton;
