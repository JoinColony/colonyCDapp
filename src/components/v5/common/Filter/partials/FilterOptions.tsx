import React, { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useMobile } from '~hooks';

import SubNavigationItem from '~v5/shared/SubNavigationItem';
import Header from '~v5/shared/SubNavigationItem/partials/Header';
import Accordion from './Accordion';
import { useFilterContext } from '~context/FilterContext';
import { followersFilterOptions } from '../consts';

const displayName = 'v5.common.Filter.partials.FilterOptions';

const FilterOptions: FC = () => {
  const isMobile = useMobile();
  const location = useLocation();
  const isFollowersPage = location.pathname.split('/').at(-1) === 'followers';

  const { filterOptions } = useFilterContext();
  const options = isFollowersPage ? followersFilterOptions : filterOptions;

  return (
    <div>
      <Header title={{ id: 'filters' }} />
      {isMobile ? (
        <Accordion items={options} />
      ) : (
        <ul className="flex flex-col">
          {options?.map(({ id, iconName, title, filterType, content }) => (
            <SubNavigationItem
              key={id}
              iconName={iconName}
              title={title}
              option={filterType}
              nestedFilters={content}
              iconSize="tiny"
            />
          ))}
        </ul>
      )}
    </div>
  );
};

FilterOptions.displayName = displayName;

export default FilterOptions;
