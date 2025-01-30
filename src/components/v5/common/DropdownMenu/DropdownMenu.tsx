import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, useEffect, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import KebapMenu from '~v5/shared/KebapMenu/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import DropdownMenuItem from './partials/DropdownMenuItem/index.ts';
import { type DropdownMenuProps } from './types.ts';

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

  useEffect(() => {
    if (!visible) {
      setActiveGroupIndex(undefined);
      setActiveSubMenuIndex(undefined);
    }
  }, [visible]);

  const popoverSubMenu =
    activeGroupIndex !== undefined && activeSubMenuIndex !== undefined
      ? groups[activeGroupIndex].items[activeSubMenuIndex]
      : undefined;

  const popoverSubMenuItems = popoverSubMenu?.items;
  return (
    <div className={className}>
      <KebapMenu
        isVertical
        setTriggerRef={setTriggerRef}
        className={clsx('!duration-0', {
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
          className="z-dropdown w-dvw overflow-hidden px-6 sm:w-auto sm:px-0"
        >
          <ul
            className={clsx('w-full px-6 sm:w-[14.625rem]', {
              'transition-transform': showSubMenuInPopover,
              'translate-x-0':
                activeSubMenuIndex === undefined && showSubMenuInPopover,
              'absolute -translate-x-full':
                activeSubMenuIndex !== undefined && showSubMenuInPopover,
            })}
          >
            {groups.map(({ key, items }, index) => (
              <li
                key={key}
                className="mb-3 border-b border-b-gray-200 pb-3 last:mb-0 last:border-0 last:pb-0"
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
                className={clsx('px-6 transition-transform sm:w-[20rem]', {
                  'translate-x-0': activeSubMenuIndex !== undefined,
                  'translate-x-full': activeSubMenuIndex === undefined,
                })}
              >
                <div className="flex flex-col">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 py-2 uppercase text-gray-400 text-4 sm:hover:text-blue-400"
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
