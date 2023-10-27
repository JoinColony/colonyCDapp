import React, { FC, useState } from 'react';
import clsx from 'clsx';

import { usePopperTooltip } from 'react-popper-tooltip';
import { useMobile } from '~hooks';
import Checkbox from '~v5/common/Checkbox';

import { NestedOptionsProps } from '../types';
import Header from './Header';
import { useFilterContext } from '~context/FilterContext';
import { formatText } from '~utils/intl';
import PopoverBase from '~v5/shared/PopoverBase';

const displayName = 'v5.SubNavigationItem.partials.NestedOptions';

const NestedOptions: FC<NestedOptionsProps> = ({
  parentOption,
  nestedFilters,
}) => {
  const isMobile = useMobile();
  const { handleFilterSelect, isFilterChecked } = useFilterContext();
  const [checkedParent, setCheckedParent] = useState<string | null>(null);

  const { getTooltipProps, setTooltipRef, setTriggerRef } = usePopperTooltip({
    delayShow: 200,
    delayHide: 200,
    placement: 'left-start',
    trigger: 'click',
    interactive: true,
  });

  const filterTitle = `${parentOption}.type`;

  return (
    <>
      {!isMobile && <Header title={{ id: filterTitle }} />}
      <ul
        className={clsx('flex flex-col', {
          'mt-1': isMobile,
        })}
      >
        {(nestedFilters || []).map(({ id, title, icon, children }) => {
          const hasChildren = children && children?.length > 0;
          const isChecked = hasChildren
            ? checkedParent === id
            : isFilterChecked(id);

          return (
            <li key={id}>
              <button
                className={clsx('subnav-button', {
                  'px-0': isMobile,
                })}
                type="button"
                aria-label={formatText({ id: 'checkbox.select.filter' })}
                ref={setTriggerRef}
              >
                <Checkbox
                  id={id}
                  name={formatText(title) ?? ''}
                  label={title}
                  onChange={
                    hasChildren
                      ? () => {
                          if (isChecked) {
                            setCheckedParent(null);
                            return;
                          }

                          setCheckedParent(id);
                        }
                      : handleFilterSelect
                  }
                  isChecked={isChecked}
                  mode="secondary"
                >
                  {icon}
                </Checkbox>
              </button>
              {children && children.length > 0 && isChecked && (
                <PopoverBase
                  setTooltipRef={setTooltipRef}
                  tooltipProps={getTooltipProps}
                  withTooltipStyles={false}
                  cardProps={{
                    rounded: 's',
                    hasShadow: true,
                    className: 'py-4 px-2',
                  }}
                  classNames="w-full sm:max-w-[17.375rem] mr-2"
                >
                  <NestedOptions
                    parentOption={`custom.${parentOption}`}
                    nestedFilters={children}
                  />
                </PopoverBase>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

NestedOptions.displayName = displayName;

export default NestedOptions;
