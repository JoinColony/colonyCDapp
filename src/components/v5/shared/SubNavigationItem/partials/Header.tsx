import React, { FC } from 'react';
import clsx from 'clsx';

import { HeaderProps } from '../types';
import { useMobile } from '~hooks';
import TitleLabel from '~v5/shared/TitleLabel';

const displayName = 'v5.SubNavigationItem.partials.Header';

const Header: FC<HeaderProps> = ({ title }) => {
  const isMobile = useMobile();

  return (
    <TitleLabel
      className={clsx({
        'ml-5 mb-1': !isMobile,
        'mb-4': isMobile,
      })}
      text={title}
    />
  );
};

Header.displayName = displayName;

export default Header;
