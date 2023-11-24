import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import clsx from 'clsx';
import Icon from '~shared/Icon';
import { BurgerMenuProps } from './types';

const displayName = 'v5.BurgerMenu';

const BurgerMenu: FC<BurgerMenuProps> = ({
  className,
  isVertical,
  setTriggerRef,
}) => {
  const { formatMessage } = useIntl();

  return (
    <button
      type="button"
      className={clsx(
        className,
        'text-gray-400 md:hover:text-blue-400 p-[0.1875rem] transition-all duration-normal cursor-pointer flex justify-center items-center',
      )}
      aria-label={formatMessage({ id: 'ariaLabel.openMenu' })}
      ref={setTriggerRef}
    >
      <Icon
        name={isVertical ? 'dots-three-vertical' : 'dots-three'}
        appearance={{ size: 'extraTiny' }}
      />
    </button>
  );
};

BurgerMenu.displayName = displayName;

export default BurgerMenu;
