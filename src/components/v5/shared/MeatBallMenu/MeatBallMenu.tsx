import { DotsThree, X } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import Portal from '~v5/shared/Portal/index.ts';

import HoverWidthWrapper from '../HoverWidthWrapper/index.ts';
import MenuContainer from '../MenuContainer/index.ts';

import { type MeatBallMenuProps } from './types.ts';
import { DEFAULT_ITEM_WRAPPER_RENDERER } from './utils.tsx';

const displayName = 'v5.shared.MeatBallMenu';

const MeatBallMenu: FC<MeatBallMenuProps> = ({
  items,
  disabled,
  buttonClassName,
  className,
  renderItemWrapper = DEFAULT_ITEM_WRAPPER_RENDERER,
  withVerticalIcon,
  contentWrapperClassName,
  dropdownPlacementProps,
  iconSize = 16,
}) => {
  const [
    isMenuOpen,
    { toggle: toggleMenu, toggleOff: toggleMenuOff, registerContainerRef },
  ] = useToggle();
  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isMenuOpen], dropdownPlacementProps);

  if (!items.length) {
    throw new Error('There are no items added to the menu.');
  }

  return (
    <div className={clsx(className, 'md:relative')} ref={registerContainerRef}>
      <button
        type="button"
        ref={relativeElementRef}
        onClick={disabled ? undefined : toggleMenu}
        aria-label={formatText({ id: 'ariaLabel.openMenu' })}
        className={clsx(
          typeof buttonClassName === 'function'
            ? buttonClassName(isMenuOpen)
            : buttonClassName,
          'flex items-center justify-center p-[0.1875rem] transition-all duration-normal',
          {
            'cursor-pointer md:hover:text-blue-400': !disabled,
            'cursor-default': disabled,
            'text-gray-600': !isMenuOpen,
            'text-blue-400': isMenuOpen,
          },
        )}
      >
        <DotsThree
          size={iconSize}
          className={clsx({
            'rotate-90': withVerticalIcon,
          })}
        />
      </button>
      {isMenuOpen && (
        <Portal>
          <MenuContainer
            className={clsx(
              contentWrapperClassName,
              'absolute z-sidebar overflow-y-auto px-6 py-4',
            )}
            hasShadow
            rounded="s"
            ref={(ref) => {
              registerContainerRef(ref);
              portalElementRef.current = ref;
            }}
          >
            <div className="mb-3 flex items-center justify-between sm:hidden">
              <p className="uppercase text-gray-400 text-4">
                {formatText({ id: 'meatballMenu.selectAction' })}
              </p>
              <button
                type="button"
                className="text-gray-400"
                onClick={toggleMenuOff}
              >
                <X size={18} />
              </button>
            </div>
            <ul>
              {items.map(
                ({
                  key,
                  label,
                  onClick,
                  icon: Icon,
                  renderItemWrapper: itemRenderItemWrapper,
                  className: itemClassName,
                }) => (
                  <li
                    key={key}
                    className={clsx(itemClassName, 'flex-shrink-0')}
                  >
                    <HoverWidthWrapper hoverClassName="w-full md:font-medium">
                      {(itemRenderItemWrapper || renderItemWrapper)(
                        {
                          className: `
                            flex
                            items-center
                            text-md
                            transition-colors
                            duration-normal
                            md:hover:text-gray-900
                            md:hover:bg-gray-50
                            md:hover:font-medium
                            rounded
                            py-2
                            px-4
                            gap-2
                            flex-grow
                            -mx-4
                          `,
                          onClick: () => {
                            if (onClick?.() === false) {
                              return;
                            }

                            toggleMenuOff();
                          },
                        },
                        <>
                          {Icon ? <Icon size={16} /> : null}
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
