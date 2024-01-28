import React, { type FC } from 'react';
import { useLocation } from 'react-router-dom';

import { useFilterContext } from '~context/FilterContext.tsx';
import { useMobile } from '~hooks/index.ts';
import SubNavigationItem from '~v5/shared/SubNavigationItem/index.ts';
import Header from '~v5/shared/SubNavigationItem/partials/Header.tsx';

import { followersFilterOptions } from '../consts.tsx';

import Accordion from './Accordion.tsx';
import { type FilterOptionsProps } from './types.ts';

const displayName = 'v5.common.Filter.partials.FilterOptions';

const FilterOptions: FC<FilterOptionsProps> = ({ excludeFilterType }) => {
  const isMobile = useMobile();
  const location = useLocation();
  const isFollowersPage = location.pathname.split('/').at(-1) === 'followers';

  const { filterOptions } = useFilterContext();

  const options = isFollowersPage ? followersFilterOptions : filterOptions;
  const filteredOptions = excludeFilterType
    ? options?.filter(({ filterType }) => filterType !== excludeFilterType)
    : options;

  return (
    <div>
      <Header title={{ id: 'filters' }} />
      {isMobile ? (
        <Accordion items={filteredOptions} />
      ) : (
        <ul className="flex flex-col">
          {filteredOptions?.map(
            ({ id, iconName, title, filterType, content }) => (
              <SubNavigationItem
                key={id}
                iconName={iconName}
                title={title}
                option={filterType}
                nestedFilters={content}
                iconSize="tiny"
              />
            ),
          )}
        </ul>
      )}
    </div>
  );
};

FilterOptions.displayName = displayName;

export default FilterOptions;
