import React, { FC } from 'react';
import clsx from 'clsx';

import { useMobile } from '~hooks';
import Checkbox from '~v5/common/Checkbox';

import { NestedOptionsProps } from '../types';
import Header from './Header';
import { useFilterContext } from '~context/FilterContext';
import { formatText } from '~utils/intl';
import { FilterTypes } from '~v5/common/TableFiltering/types';
import { FilteringMethod } from '~gql';
import { NestedFilterOption } from '~v5/common/Filter/types';

const displayName = 'v5.SubNavigationItem.partials.NestedOptions';

const NestedOptions: FC<NestedOptionsProps> = ({
  parentOption,
  nestedFilters,
}) => {
  const isMobile = useMobile();
  const {
    handleFilterSelect,
    filteringMethod,
    setFilteringMethod,
    isFilterChecked,
  } = useFilterContext();
  const filterTitle = `${parentOption}.type`;

  return (
    <>
      {!isMobile && <Header title={{ id: filterTitle }} />}
      {/* Note: the "Union" checkbox is a temporary proof of concept to demonstrate the difference between a union
       * filter and an intersection filter. It will be added to the spec, and can then be adjusted accordingly.
       */}
      {parentOption === FilterTypes.Team && (
        <Checkbox
          id="team.union"
          name="Union"
          label="Union"
          onChange={() =>
            setFilteringMethod((prev: FilteringMethod) =>
              prev === FilteringMethod.Union
                ? FilteringMethod.Intersection
                : FilteringMethod.Union,
            )
          }
          isChecked={filteringMethod === FilteringMethod.Union}
          mode="secondary"
        />
      )}
      <ul
        className={clsx('flex flex-col', {
          'mt-1': isMobile,
        })}
      >
        {(nestedFilters || []).map(({ id, title, icon }) => {
          const [, nestedOption] = id.split('.');

          const isChecked = isFilterChecked(
            parentOption,
            nestedOption as NestedFilterOption,
          );

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
