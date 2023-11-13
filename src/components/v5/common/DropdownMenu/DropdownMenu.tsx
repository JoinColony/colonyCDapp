import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { usePopperTooltip } from 'react-popper-tooltip';

import { CaretLeft, CaretRight } from 'phosphor-react';
import BurgerMenu from '~v5/shared/BurgerMenu';
import PopoverBase from '~v5/shared/PopoverBase';
import DropdownMenuItem from './partials/DropdownMenuItem';

import { DropdownMenuProps } from './types';

const DropdownMenu: FC<DropdownMenuProps> = ({
  groups,
  className,
  showSubMenuInPopover,
}) => {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      delayShow: 200,
      delayHide: 200,
      placement: 'bottom-start',
      trigger: ['click'],
      interactive: true,
      closeOnOutsideClick: true,
    });
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | undefined>(
    undefined,
  );
  const [activeSubMenuIndex, setActiveSubMenuIndex] = useState<
    number | undefined
  >(undefined);

  const popoverSubMenu =
    activeGroupIndex !== undefined && activeSubMenuIndex !== undefined
      ? groups[activeGroupIndex].items[activeSubMenuIndex]
      : undefined;

  const popoverSubMenuItems = popoverSubMenu?.items;
  return (
    <div className={className}>
      <BurgerMenu
        isVertical
        setTriggerRef={setTriggerRef}
        className={clsx('transition-all', {
          '!text-blue-400': visible,
          'text-gray-900': !visible,
        })}
      />
      {visible && !!groups.length && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={getTooltipProps}
          withTooltipStyles={false}
          cardProps={{
            rounded: 's',
            hasShadow: true,
            className: 'py-4 px-0',
          }}
          classNames="overflow-hidden w-full px-6 sm:px-0 sm:w-auto"
        >
          <ul
            className={clsx('w-full px-6 sm:w-[14.625rem]', {
              'transition-transform': showSubMenuInPopover,
              'translate-x-0':
                activeSubMenuIndex === undefined && showSubMenuInPopover,
              '-translate-x-full absolute':
                activeSubMenuIndex !== undefined && showSubMenuInPopover,
            })}
          >
            {groups.map(({ key, items }, index) => (
              <li
                key={key}
                className="mb-3 pb-3 border-b border-b-gray-200 last:mb-0 last:pb-0 last:border-0"
              >
                <ul>
                  {items.map(
                    (
                      { key: itemKey, items: subMenu, onClick, ...item },
                      itemIndex,
                    ) => (
                      <li
                        key={itemKey}
                        className="-mx-3.5 w-[calc(100%+1.5rem)]"
                      >
                        <DropdownMenuItem
                          {...item}
                          items={showSubMenuInPopover ? undefined : subMenu}
                          chevronIcon={
                            subMenu && showSubMenuInPopover
                              ? CaretRight
                              : undefined
                          }
                          onClick={(e) => {
                            onClick?.(e);
                            if (subMenu && showSubMenuInPopover) {
                              setActiveGroupIndex(index);
                              setActiveSubMenuIndex(itemIndex);
                            }
                          }}
                        />
                      </li>
                    ),
                  )}
                </ul>
              </li>
            ))}
          </ul>
          {activeSubMenuIndex !== undefined &&
            activeGroupIndex !== undefined &&
            showSubMenuInPopover &&
            popoverSubMenuItems?.length && (
              <div
                className={clsx('transition-transform px-6 sm:w-[20rem]', {
                  'translate-x-0': activeSubMenuIndex !== undefined,
                  'translate-x-full': activeSubMenuIndex === undefined,
                })}
              >
                <div className="flex flex-col">
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 text-gray-400 uppercase text-4 py-2"
                    onClick={() => {
                      setActiveGroupIndex(undefined);
                      setActiveSubMenuIndex(undefined);
                    }}
                  >
                    <CaretLeft size={16} className="flex-shrink-0" />
                    {popoverSubMenu?.label}
                  </button>
                  <ul>
                    {popoverSubMenuItems.map(({ key, onClick, ...item }) => (
                      <li key={key} className="-mx-3.5 w-[calc(100%+1.5rem)]">
                        <DropdownMenuItem
                          {...item}
                          onClick={(e) => {
                            onClick?.(e);
                            setActiveGroupIndex(undefined);
                            setActiveSubMenuIndex(undefined);
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
        </PopoverBase>
      )}
    </div>
  );
};

export default DropdownMenu;
