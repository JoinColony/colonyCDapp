import clsx from 'clsx';
import React, { type FC } from 'react';

import { useMobile } from '~hooks/index.ts';
import TitleLabel from '~v5/shared/TitleLabel/index.ts';

import { type HeaderProps } from '../types.ts';

const displayName = 'v5.SubNavigationItem.partials.Header';

const Header: FC<HeaderProps> = ({ title, className, textSizeClassName }) => {
  const isMobile = useMobile();

  return (
    <TitleLabel
      className={clsx(className, {
        'ml-3.5': !isMobile,
        'mb-4': isMobile,
      })}
      textSizeClassName={textSizeClassName}
      text={title}
    />
  );
};

Header.displayName = displayName;

export default Header;
