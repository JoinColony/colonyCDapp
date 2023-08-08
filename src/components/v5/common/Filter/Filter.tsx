import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';

import { useMobile } from '~hooks';
import FilterButton from '~v5/shared/Filter/FilterButton';
import FilterOptions from './partials/FilterOptions';
import Modal from '~v5/shared/Modal';
import PopoverBase from '~v5/shared/PopoverBase';
import { useMembersPage } from '~frame/v5/pages/MembersPage/hooks';
// import TableFiltering from '../TableFiltering';
import SearchInput from './partials/SearchInput';
import Button from '~v5/shared/Button';
import Icon from '~shared/Icon';
import { filterOptions, followersFilterOptions } from './consts';
import { useFilterContext } from '~context/FilterContext';

const displayName = 'v5.common.Filter';

const Filter: FC = () => {
  const { formatMessage } = useIntl();
  const [isOpened, setOpened] = useState(false);
  const [isSearchOpened, setIsSearchOpened] = useState(false);
  const isMobile = useMobile();
  const {
    // selectedFilters,
    onSelectParentFilter,
    onSelectNestedOption,
    // onClearFilters,
    selectedChildOption,
    numberSelectedFilters,
    // selectedParentFilters,
    checkedItems,
    isFollowersPage,
  } = useFilterContext();
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    useMembersPage();

  return (
    <>
      {isMobile ? (
        <div className="flex items-center gap-2">
          <FilterButton
            isOpen={isOpened}
            onClick={() => setOpened(!isOpened)}
            numberSelectedFilters={numberSelectedFilters}
          />
          <Button
            mode="primaryOutline"
            className="sm:hidden flex min-h-[2.25rem]"
            size="small"
            aria-label={formatMessage({ id: 'ariaLabel.openSearchModal' })}
            onClick={() => setIsSearchOpened(true)}
          >
            <Icon name="magnifying-glass" appearance={{ size: 'tiny' }} />
          </Button>
          <Modal
            isFullOnMobile={false}
            onClose={() => setOpened(false)}
            isOpen={isOpened}
          >
            <FilterOptions
              options={filterOptions}
              onSelectParentFilter={onSelectParentFilter}
              onSelectNestedOption={onSelectNestedOption}
              selectedChildOption={selectedChildOption}
              checkedItems={checkedItems}
            />
          </Modal>
          <Modal
            isFullOnMobile={false}
            onClose={() => setIsSearchOpened(false)}
            isOpen={isSearchOpened}
          >
            <p className="text-4 text-gray-400 mb-4">
              {formatMessage({ id: 'filter.search.title' })}
            </p>
            <div className="sm:px-3.5 sm:mb-6">
              <SearchInput
                onSearchButtonClick={() => setIsSearchOpened(false)}
              />
            </div>
          </Modal>
        </div>
      ) : (
        <>
          <div className="flex flex-row gap-2">
            {/* @TODO: uncomment that after API for filtering will be ready */}
            {/* {!!selectedFilters?.length && (
              <TableFiltering
                selectedParentFilters={selectedParentFilters}
                filterOptions={selectedFilters}
                onClick={() => onClearFilters()}
              />
            )} */}
            <FilterButton isOpen={visible} setTriggerRef={setTriggerRef} />
          </div>
          {visible && (
            <PopoverBase
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              withTooltipStyles={false}
              cardProps={{
                rounded: 's',
                hasShadow: true,
                className: 'pt-6 pb-4 px-2.5',
              }}
              classNames="w-full sm:max-w-[17.375rem]"
            >
              <div className="sm:px-3.5 sm:mb-6">
                <SearchInput
                  onSearchButtonClick={() => setIsSearchOpened(false)}
                />
              </div>
              <FilterOptions
                options={
                  isFollowersPage ? followersFilterOptions : filterOptions
                }
                onSelectParentFilter={onSelectParentFilter}
                onSelectNestedOption={onSelectNestedOption}
                selectedChildOption={selectedChildOption}
                checkedItems={checkedItems}
              />
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
};

Filter.displayName = displayName;

export default Filter;
