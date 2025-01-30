import { DotsThreeVertical } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

interface DropdownMenuProps extends PropsWithChildren {
  isDisabled?: boolean;
  setTriggerRef: (node: HTMLElement | null) => void;
  setTooltipRef: (node: HTMLElement | null) => void;
  getTooltipProps: () => Record<string, any>;
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
  return (
    <>
      <button
        type="button"
        ref={setTriggerRef}
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
          ref={setTooltipRef}
          {...getTooltipProps()}
          className="z-dropdown w-dvw px-6 sm:w-auto sm:px-0"
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
