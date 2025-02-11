import { DotsThree } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useRef, type FC } from 'react';

import { useMobile } from '~hooks';
import useDropdown from '~hooks/useDropdown.ts';
import { formatText } from '~utils/intl.ts';

import MenuContainer from '../MenuContainer/index.ts';

import { useMobileMenuPosition } from './hooks.ts';
import { MeatBallMenuCloseTrigger } from './partials/MeatBallMenuCloseTrigger.tsx';
import { MeatBallMenuItems } from './partials/MeatBallMenuItems.tsx';
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
  hasLeftAlignment = false,
  iconSize = 16,
}) => {
  const isMobile = useMobile();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const {
    setIsDropdownOpen,
    setTriggerRef,
    setTooltipRef,
    getTooltipProps,
    visible,
  } = useDropdown();

  if (!items.length) {
    throw new Error('There are no items added to the menu.');
  }

  useMobileMenuPosition({
    isMobile,
    hasLeftAlignment,
    triggerRef,
    menuRef,
  });

  const handleOnClose = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className={clsx(className, 'relative')}>
      <button
        type="button"
        ref={(ref) => {
          setTriggerRef(ref);
          triggerRef.current = ref;
        }}
        aria-label={formatText({ id: 'ariaLabel.openMenu' })}
        className={clsx(
          typeof buttonClassName === 'function'
            ? buttonClassName(visible)
            : buttonClassName,
          'flex items-center justify-center p-[0.1875rem] transition-all duration-normal',
          {
            'cursor-pointer md:hover:text-blue-400': !disabled,
            'cursor-default': disabled,
            'text-gray-600': !visible,
            'text-blue-400': visible,
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
      {visible && (
        <MenuContainer
          className={clsx(
            contentWrapperClassName,
            'absolute !right-0 z-dropdown w-[calc(100vw-2.4rem)] min-w-[calc(100vw-2.4rem)] overflow-y-auto px-6 py-4 sm:w-fit sm:min-w-fit',
          )}
          hasShadow
          rounded="s"
          {...getTooltipProps()}
          ref={(ref) => {
            setTooltipRef(ref);
            menuRef.current = ref;
          }}
        >
          <MeatBallMenuCloseTrigger onClick={handleOnClose} />
          <MeatBallMenuItems
            items={items}
            renderItemWrapper={renderItemWrapper}
            onClose={handleOnClose}
          />
          {/* <p>asddsa</p> */}
        </MenuContainer>
      )}
    </div>
  );
};

MeatBallMenu.displayName = displayName;

export default MeatBallMenu;
