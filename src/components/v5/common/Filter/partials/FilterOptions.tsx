import clsx from 'clsx';
import React, { type FC } from 'react';
import { useLocation } from 'react-router-dom';

import { useFilterContext } from '~context/FilterContext/FilterContext.ts';
import { useMobile } from '~hooks/index.ts';
import SubNavigationItem from '~v5/shared/SubNavigationItem/index.ts';
import Header from '~v5/shared/SubNavigationItem/partials/Header.tsx';

import { followersFilterOptions } from '../consts.ts';

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
      <Header
        title={{ id: isMobile ? 'filterAndSort' : 'filterBy' }}
        className={clsx({
          'text-gray-900 capitalize mb-6': isMobile,
        })}
        textSizeClassName={isMobile ? 'heading-5' : 'text-4'}
      />
      {isMobile ? (
        <Accordion items={filteredOptions} />
      ) : (
        <ul className="flex flex-col">
          {filteredOptions?.map(
            ({ id, icon, title, filterType, content, header }) => (
              <li key={id}>
                {header && <Header title={{ id: header }} className="mt-2" />}
                <SubNavigationItem
                  icon={icon}
                  title={title}
                  option={filterType}
                  nestedFilters={content}
                  iconSize={14}
                />
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
};

FilterOptions.displayName = displayName;

export default FilterOptions;
