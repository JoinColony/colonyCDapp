import React, { FC } from 'react';

import Icon from '~shared/Icon/Icon';
import { BurgerMenuProps } from './types';

const displayName = 'v5.shared.BurgerMenu.BurgerMenu';

const BurgerMenu: FC<BurgerMenuProps> = ({ isVertical }) => (
  <button
    type="button"
    className="text-gray-400 hover:text-blue-400 transition-all duration-normal cursor-pointer"
  >
    <Icon
      name={isVertical ? 'dots-three-vertical' : 'dots-three'}
      appearance={{ size: 'extraTiny' }}
    />
  </button>
);

BurgerMenu.displayName = displayName;

export default BurgerMenu;
