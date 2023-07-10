import React, { FC } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';

import { HeaderProps } from '../types';
import { useMobile } from '~hooks';

const displayName = 'v5.SubNavigationItem.partials.Header';

const Header: FC<HeaderProps> = ({ title }) => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();

  return (
    <span
      className={clsx('flex text-4 text-gray-400 uppercase', {
        'ml-5 mb-1': !isMobile,
        'mb-4': isMobile,
      })}
    >
      {formatMessage(title)}
    </span>
  );
};

Header.displayName = displayName;

export default Header;
