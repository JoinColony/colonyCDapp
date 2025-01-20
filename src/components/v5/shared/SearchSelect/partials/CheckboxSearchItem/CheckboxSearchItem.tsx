import clsx from 'clsx';
import React from 'react';

import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/Checkbox.tsx';
import ExtensionsStatusBadge from '~v5/common/Pills/ExtensionStatusBadge/index.ts';
import {
  hasOptionVisualElement,
  sortDisabled,
} from '~v5/shared/SearchSelect/utils.ts';

import { type CheckboxSearchItemProps } from './types.ts';

const displayName = 'v5.SearchSelect.partials.CheckboxSearchItem';

const CheckboxSearchItem = <T,>({
  options,
  onChange,
  checkboxesList,
  isLabelVisible = true,
  renderOption,
}: CheckboxSearchItemProps<T>) => {
  const isMobile = useMobile();

  return (
    <ul
      className={clsx({
        'w-full': isLabelVisible,
        '-mx-2 flex flex-wrap items-center gap-y-4 sm:w-[8.75rem]':
          !isLabelVisible,
        'sm:w-[12.75rem]': !isLabelVisible && isMobile,
      })}
    >
      {sortDisabled(options).map((option) => {
        const { value, isDisabled } = option;
        const firstDisabledOption = options.filter((o) => o.isDisabled)[0];

        const hasVisual = hasOptionVisualElement(option);

        return (
          <li
            className={clsx({
              'mb-1 w-full': isLabelVisible,
              'inline-flex w-1/4': !isLabelVisible,
            })}
            key={value}
          >
            <label
              className={clsx(
                'flex w-full items-center rounded px-2 py-1.5 text-left text-md transition-colors hover:bg-gray-50 hover:font-medium',
                {
                  'justify-between': !hasVisual,
                  'justify-start': hasVisual,
                  'pointer-events-none gap-1 text-gray-400': isDisabled,

                  'justify-center': !isLabelVisible,
                  'cursor-pointer': !!checkboxesList,
                },
              )}
              htmlFor={value.toString()}
            >
              <div className="relative flex w-full items-center">
                {checkboxesList && (
                  <Checkbox
                    name={value.toString()}
                    id={value.toString()}
                    isChecked={checkboxesList.includes(value.toString())}
                    onChange={() => {
                      onChange?.(value);
                    }}
                  />
                )}
                {renderOption(option, isLabelVisible)}
                {firstDisabledOption?.value === value && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 transform">
                    <ExtensionsStatusBadge
                      mode="coming-soon"
                      text={formatText({ id: 'status.comingSoon' })}
                    />
                  </div>
                )}
              </div>
            </label>
          </li>
        );
      })}
    </ul>
  );
};

CheckboxSearchItem.displayName = displayName;

export default CheckboxSearchItem;
