import React, { FC, useLayoutEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import useToggle from '~hooks/useToggle';
import Icon from '~shared/Icon';
import Card from '../Card';
import { MeatBallMenuProps } from './types';
import { useMobile } from '~hooks';

const displayName = 'v5.MeatBallMenu';

const MeatBallMenu: FC<MeatBallMenuProps> = ({
  items,
  cardClassName,
  buttonClassName,
}) => {
  const { formatMessage } = useIntl();
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [
    isMenuOpen,
    {
      toggle: toggleMenu,
      toggleOff: toggleMenuOff,
      registerContainerRef,
      currentElementRef,
    },
  ] = useToggle();

  const isMobile = useMobile();

  useLayoutEffect(() => {
    if (!isMenuOpen) return;

    const buttonElement = buttonRef.current;

    if (buttonElement) {
      const buttonTopPosition = buttonElement.offsetTop;
      const buttonLeftPosition = buttonElement.offsetLeft;
      const elementWidth =
        currentElementRef.current?.getBoundingClientRect().width || 0;
      const buttonHeight = buttonElement.getBoundingClientRect().height;
      const buttonWidth = buttonElement.getBoundingClientRect().width;

      setPosition({
        top: buttonTopPosition + buttonHeight,
        left: buttonLeftPosition - elementWidth + buttonWidth,
      });
    }
  }, [currentElementRef, isMenuOpen]);

  return (
    <div>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        aria-label={formatMessage({ id: 'ariaLabel.openMenu' })}
        className={clsx(
          buttonClassName,
          'text-gray-400 p-[0.1875rem] transition-all duration-normal cursor-pointer md:hover:text-blue-400',
        )}
      >
        <Icon name="dots-three" appearance={{ size: 'extraTiny' }} />
      </button>
      {isMenuOpen && (
        <Card
          className={clsx(cardClassName, 'px-2.5 py-4 w-auto absolute z-50')}
          style={{
            top: `${position.top}px`,
            left: isMobile ? 0 : `${position.left}px`,
            right: isMobile ? 0 : 'auto',
          }}
          hasShadow
          rounded="s"
          ref={registerContainerRef}
        >
          <ul>
            {items.map(({ key, label, onClick, iconName }) => (
              <li key={key} className="flex-shrink-0">
                <button
                  type="button"
                  className="flex w-full items-center text-md transition-colors
                  duration-normal md:hover:bg-gray-50 rounded py-2 px-3.5"
                  onClick={() => {
                    onClick();
                    toggleMenuOff();
                  }}
                >
                  <Icon name={iconName} appearance={{ size: 'extraSmall' }} />
                  <span className="ml-2">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

MeatBallMenu.displayName = displayName;

export default MeatBallMenu;
