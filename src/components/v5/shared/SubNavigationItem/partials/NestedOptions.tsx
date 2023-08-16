import React, { FC } from 'react';
import clsx from 'clsx';

import { useMobile } from '~hooks';
import Checkbox from '~v5/common/Checkbox';

import { NestedOptionsProps } from '../types';
import Header from './Header';
import { useFilterContext } from '~context/FilterContext';
import { formatText } from '~utils/intl';

const displayName = 'v5.SubNavigationItem.partials.NestedOptions';

const NestedOptions: FC<NestedOptionsProps> = ({
  parentOption,
  nestedFilters,
}) => {
  const isMobile = useMobile();
  const { handleFilterSelect, isFilterChecked } = useFilterContext();

  const filterTitle = `${parentOption}.type`;

  return (
    <>
      {!isMobile && <Header title={{ id: filterTitle }} />}
      <ul
        className={clsx('flex flex-col', {
          'mt-1': isMobile,
        })}
      >
        {(nestedFilters || []).map(({ id, title, icon }) => {
          const isChecked = isFilterChecked(id);

          return (
            <li key={id}>
              <button
                className={clsx('subnav-button', {
                  'px-0': isMobile,
                })}
                type="button"
                aria-label={formatText({ id: 'checkbox.select.filter' })}
              >
                <Checkbox
                  id={id}
                  name={formatText(title) ?? ''}
                  label={title}
                  onChange={handleFilterSelect}
                  isChecked={isChecked}
                  mode="secondary"
                >
                  {icon}
                </Checkbox>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
};

NestedOptions.displayName = displayName;

export default NestedOptions;
