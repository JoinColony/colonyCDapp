import { MagnifyingGlass } from '@phosphor-icons/react';
import React, { type FC, useCallback, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useMobile } from '~hooks';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import SearchInputMobile from '~v5/common/Filter/partials/SearchInput/SearchInput.tsx';
import Button from '~v5/shared/Button/index.ts';
import FilterButton from '~v5/shared/Filter/FilterButton.tsx';
import Modal from '~v5/shared/Modal/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';
import SearchInputDesktop from '~v5/shared/SearchSelect/partials/SearchInput/index.ts';
import Header from '~v5/shared/SubNavigationItem/partials/Header.tsx';

import FilterItem from './FilterItem.tsx';
import { type TeamsPageFilterProps } from './types.ts';

const TeamsPageFilter: FC<TeamsPageFilterProps> = ({
  onSearch,
  searchValue,
  items,
  onChange,
  filterValue,
  hasFilterChanged,
}) => {
  const {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible: isFiltersOpen,
  } = usePopperTooltip({
    delayShow: 200,
    delayHide: 200,
    placement: 'bottom-end',
    trigger: 'click',
    interactive: true,
  });
  const isMobile = useMobile();
  const [isModalOpen, { toggleOff: toggleModalOff, toggleOn: toggleModalOn }] =
    useToggle();
  const onInputChange = useCallback(
    (inputValue: string) => {
      onSearch(inputValue);
    },
    [onSearch],
  );
  const [isSearchOpened, setIsSearchOpened] = useState(false);

  const RootItems = items.map(
    ({ icon, items: nestedItems, label, name, title, filterName }) => (
      <FilterItem
        filterValue={filterValue}
        key={name.toString()}
        label={label}
        icon={icon}
        title={title}
        name={name}
        items={nestedItems}
        onChange={onChange}
        filterName={filterName}
      />
    ),
  );

  return (
    <>
      <div className="flex flex-row gap-2">
        <FilterButton
          isOpen={isFiltersOpen}
          onClick={toggleModalOn}
          setTriggerRef={setTriggerRef}
          customLabel={formatText({ id: 'teamsPage.filter.filterButton' })}
          numberSelectedFilters={hasFilterChanged && isMobile ? 1 : 0}
        />
        {isMobile && (
          <Button
            mode="tertiary"
            className="flex sm:hidden"
            size="small"
            aria-label={formatText({ id: 'ariaLabel.openSearchModal' })}
            onClick={() => setIsSearchOpened(true)}
          >
            <MagnifyingGlass size={14} />
          </Button>
        )}
      </div>
      {isMobile && (
        <>
          <Modal
            isOpen={isModalOpen}
            onClose={toggleModalOff}
            isFullOnMobile={false}
            withPaddingBottom
          >
            <>
              <Header title={{ id: 'filters' }} />
              {RootItems}
            </>
          </Modal>
          <Modal
            isFullOnMobile={false}
            onClose={() => setIsSearchOpened(false)}
            isOpen={isSearchOpened}
            withPaddingBottom
          >
            <p className="mb-4 uppercase text-gray-400 text-4">
              {formatText({ id: 'teamsPage.filter.search' })}
            </p>
            <div className="sm:mb-6 sm:px-3.5">
              <SearchInputMobile
                onSearchButtonClick={() => setIsSearchOpened(false)}
                setSearchValue={onInputChange}
                searchValue={searchValue}
                searchInputPlaceholder={formatText({
                  id: 'teamsPage.filter.search',
                })}
              />
            </div>
          </Modal>
        </>
      )}
      {isFiltersOpen && !isMobile && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={getTooltipProps}
          withTooltipStyles={false}
          cardProps={{
            rounded: 's',
            hasShadow: true,
            className: 'pt-6 pb-4 px-2.5',
          }}
          classNames="w-full sm:max-w-[20.375rem]"
        >
          <div className="mb-6 px-3.5">
            <SearchInputDesktop
              onChange={onInputChange}
              placeholder={formatText({ id: 'teamsPage.filter.search' })}
              value={searchValue}
            />
          </div>
          <Header
            title={{
              id: 'teamsPage.filter.sortBy',
            }}
            className="pb-2"
          />
          {RootItems}
        </PopoverBase>
      )}
    </>
  );
};

export default TeamsPageFilter;
