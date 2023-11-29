import React, { FC } from 'react';
import clsx from 'clsx';

import { useRelativePortalElement, useToggle } from '~hooks';
import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';
import Portal from '~v5/shared/Portal';

import MenuContainer from '../MenuContainer';
import { MeatBallMenuProps } from './types';
import HoverWidthWrapper from '../HoverWidthWrapper';
import { DEFAULT_ITEM_WRAPPER_RENDERER } from './utils';

const displayName = 'v5.shared.MeatBallMenu';

const MeatBallMenu: FC<MeatBallMenuProps> = ({
  items,
  disabled,
  buttonClassName,
  className,
  renderItemWrapper = DEFAULT_ITEM_WRAPPER_RENDERER,
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
        onClick={disabled ? undefined : toggleMenu}
        aria-label={formatText({ id: 'ariaLabel.openMenu' })}
        className={clsx(
          buttonClassName,
          'p-[0.1875rem] transition-all duration-normal flex justify-center items-center',
          {
            'md:hover:text-blue-400 cursor-pointer': !disabled,
            'cursor-default': disabled,
            'text-gray-600': !isMenuOpen,
            'text-blue-400': isMenuOpen,
          },
        )}
      >
        <Icon name="dots-three" appearance={{ size: 'extraTiny' }} />
      </button>
      {isMenuOpen && (
        <Portal>
          <MenuContainer
            className="px-2.5 py-4 absolute z-[60] overflow-y-auto w-auto"
            hasShadow
            rounded="s"
            ref={(ref) => {
              registerContainerRef(ref);
              portalElementRef.current = ref;
            }}
          >
            <ul>
              {items.map(
                ({
                  key,
                  label,
                  onClick,
                  icon,
                  renderItemWrapper: itemRenderItemWrapper,
                }) => (
                  <li key={key} className="flex-shrink-0">
                    <HoverWidthWrapper hoverClassName="md:font-medium">
                      {(itemRenderItemWrapper || renderItemWrapper)(
                        {
                          className: `
                            flex w-full
                            items-center
                            text-md
                            transition-colors
                            duration-normal
                            md:hover:bg-gray-50
                            md:hover:font-medium
                            rounded
                            py-2
                            px-3.5
                            gap-2
                          `,
                          onClick: () => {
                            if (onClick?.() === false) {
                              return;
                            }

                            toggleMenuOff();
                          },
                        },
                        <>
                          {typeof icon === 'string' ? (
                            <>
                              {icon}
                              <Icon
                                name={icon}
                                appearance={{ size: 'extraSmall' }}
                              />
                            </>
                          ) : (
                            icon
                          )}
                          <span>{label}</span>
                        </>,
                      )}
                    </HoverWidthWrapper>
                  </li>
                ),
              )}
            </ul>
          </MenuContainer>
        </Portal>
      )}
    </div>
  );
};

MeatBallMenu.displayName = displayName;

export default MeatBallMenu;
