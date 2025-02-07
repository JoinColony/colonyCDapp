import { DotsThreeVertical } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useRef, type FC, type PropsWithChildren } from 'react';
import { type PropsGetterArgs } from 'react-popper-tooltip';

import { usePopperCustomPositioning } from '~hooks/usePopperCustomPositioning.ts';

interface DropdownMenuProps extends PropsWithChildren {
  isDisabled?: boolean;
  setTriggerRef: (node: HTMLElement | null) => void;
  setTooltipRef: (node: HTMLElement | null) => void;
  getTooltipProps: (args?: PropsGetterArgs) => Record<string, any>;
  visible: boolean;
}

const DropdownMenu: FC<DropdownMenuProps> = ({
  isDisabled,
  children,
  setTriggerRef,
  setTooltipRef,
  getTooltipProps,
  visible,
}) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { menuClassName, menuStyle } = usePopperCustomPositioning({
    triggerRef,
    menuRef,
    config: {
      skipDesktop: true,
      keepInitialBottomPlacement: true,
      useTriggerAsTranslateDefault: true,
      offset: {
        left: 0.25,
        top: 0.25,
      },
    },
  });

  return (
    <>
      <button
        type="button"
        ref={(ref) => {
          setTriggerRef(ref);
          triggerRef.current = ref;
        }}
        className={clsx('hover:text-blue-400', {
          'text-gray-400': !visible,
          'text-blue-400': visible,
          'pointer-events-none text-gray-100': isDisabled,
        })}
      >
        <DotsThreeVertical size={18} />
      </button>
      {visible && (
        <div
          ref={(ref) => {
            setTooltipRef(ref);
            menuRef.current = ref;
          }}
          {...getTooltipProps({
            style: menuStyle,
          })}
          className={clsx(menuClassName, 'z-dropdown px-6 sm:px-0')}
        >
          <div className="flex w-full flex-col rounded-lg border border-gray-200 bg-base-white px-3 py-4 shadow-default sm:w-[14.25rem]">
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default DropdownMenu;
