import clsx from 'clsx';
import React, { FC } from 'react';

import { useMobile } from '~hooks';
import TitleLabel from '~v5/shared/TitleLabel';

import { HeaderProps } from '../types';

const displayName = 'v5.SubNavigationItem.partials.Header';

const Header: FC<HeaderProps> = ({ title, className }) => {
  const isMobile = useMobile();

  return (
    <TitleLabel
      className={clsx(className, {
        'ml-3.5': !isMobile,
        'mb-4': isMobile,
      })}
      text={title}
    />
  );
};

Header.displayName = displayName;

export default Header;
