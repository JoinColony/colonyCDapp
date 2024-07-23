import clsx from 'clsx';
import React from 'react';

import PillsBase from '../PillsBase.tsx';

import { badgeThemes } from './consts.ts';
import { type CryptoToFiatBadgeProps } from './types.ts';

const CryptoToFiatBadge: React.FC<CryptoToFiatBadgeProps> = ({
  text,
  theme,
  icon,
}) => {
  const { className, iconClassName } = badgeThemes[theme];

  return (
    <PillsBase
      icon={icon}
      iconClassName={iconClassName}
      className={clsx(className, 'text-sm font-medium')}
      isCapitalized={false}
      text={text}
    />
  );
};

export default CryptoToFiatBadge;
