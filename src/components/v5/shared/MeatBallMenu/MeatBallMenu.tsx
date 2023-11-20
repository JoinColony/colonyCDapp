import React, { FC } from 'react';
import clsx from 'clsx';

import useToggle from '~hooks/useToggle';
import Icon from '~shared/Icon';
import { useRelativePortalElement } from '~hooks/useRelativePortalElement';
import { formatText } from '~utils/intl';
import Portal from '~v5/shared/Portal';

import Card from '../Card';
import { MeatBallMenuProps } from './types';

const displayName = 'v5.MeatBallMenu';

const MeatBallMenu: FC<MeatBallMenuProps> = ({
  items,
  buttonClassName,
  className,
}) => {
  const [
    isMenuOpen,
    { toggle: toggleMenu, toggleOff: toggleMenuOff, registerContainerRef },
  ] = useToggle();
  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isMenuOpen]);

  if (!items.length) {
    throw new Error('There are no items added to the menu.');
  }

  return (
    <div className={clsx(className, 'md:relative')}>
      <button
        type="button"
        ref={relativeElementRef}
        onClick={toggleMenu}
        aria-label={formatText({ id: 'ariaLabel.openMenu' })}
        className={clsx(
          buttonClassName,
          'p-[0.1875rem] transition-all duration-normal cursor-pointer md:hover:text-blue-400 flex justify-center items-center',
          {
            'text-gray-600': !isMenuOpen,
            'text-blue-400': isMenuOpen,
          },
        )}
      >
        <Icon name="dots-three" appearance={{ size: 'extraTiny' }} />
      </button>
      {isMenuOpen && (
        <Portal>
          <Card
            className="px-2.5 py-4 absolute z-[60] overflow-y-auto w-auto"
            hasShadow
            rounded="s"
            ref={(ref) => {
              registerContainerRef(ref);
              portalElementRef.current = ref;
            }}
          >
            <ul>
              {items.map(({ key, label, onClick, iconName }) => (
                <li key={key} className="flex-shrink-0">
                  <button
                    type="button"
                    className={`
                      flex w-full
                      items-center
                      text-md
                      transition-colors
                      duration-normal
                      md:hover:bg-gray-50
                      hover:font-medium
                      rounded
                      py-2
                      px-3.5
                      gap-2
                    `}
                    onClick={() => {
                      onClick();
                      toggleMenuOff();
                    }}
                  >
                    {iconName && (
                      <Icon
                        name={iconName}
                        appearance={{ size: 'extraSmall' }}
                      />
                    )}
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </Portal>
      )}
    </div>
  );
};

MeatBallMenu.displayName = displayName;

export default MeatBallMenu;
