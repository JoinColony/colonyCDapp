import React, { FC } from 'react';
import Icon from '~shared/Icon/Icon';
import { BurgerMenuProps } from './types';

const displayName = 'v5.shared.BurgerMenu.BurgerMenu';

const BurgerMenu: FC<BurgerMenuProps> = ({ isVertical }) => {
  return (
    <div className="text-gray-400 hover:text-blue-400 transition-all duration-norma cursor-pointer">
      <Icon
        name={isVertical ? 'dots-three-vertical' : 'dots-three'}
        appearance={{ size: 'extraTiny' }}
      />
      {/* @TODO: add dropdown with options */}
    </div>
  );
};

BurgerMenu.displayName = displayName;

export default BurgerMenu;
