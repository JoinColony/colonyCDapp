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
import { type PermissionsPageFilterProps } from './types.ts';

const PermissionsPageFilter: FC<PermissionsPageFilterProps> = ({
  onSearch,
  searchValue,
  items,
  onChange,
  filterValue,
  activeFiltersNumber,
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
    ({ icon, items: nestedItems, label, name, title }) => (
      <FilterItem
        filterValue={filterValue}
        key={name.toString()}
        label={label}
        icon={icon}
        title={title}
        name={name}
        items={nestedItems}
        onChange={onChange}
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
          customLabel={formatText({ id: 'allFilters' })}
          numberSelectedFilters={activeFiltersNumber}
        />
        {isMobile && (
          <Button
            mode="tertiary"
            className="sm:hidden flex"
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
          >
            <h4 className="sm:px-4 mb-6 sm:mb-0 heading-5 text-gray-900 capitalize">
              {formatText({ id: isMobile ? 'filterAndSort' : 'filters' })}
            </h4>
            {RootItems}
          </Modal>
          <Modal
            isFullOnMobile={false}
            onClose={() => setIsSearchOpened(false)}
            isOpen={isSearchOpened}
          >
            <p className="text-4 text-gray-400 mb-4 uppercase">
              {formatText({ id: 'permissionsPage.filter.search' })}
            </p>
            <div className="sm:px-3.5 sm:mb-6">
              <SearchInputMobile
                onSearchButtonClick={() => setIsSearchOpened(false)}
                setSearchValue={onInputChange}
                searchValue={searchValue}
                searchInputPlaceholder={formatText({
                  id: 'permissionsPage.filter.search',
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
          <div className="px-3.5 mb-6">
            <SearchInputDesktop
              onChange={onInputChange}
              placeholder={formatText({ id: 'permissionsPage.filter.search' })}
              value={searchValue}
            />
          </div>
          <Header title={{ id: 'permissionsPage.filter.filterBy' }} />
          {RootItems}
        </PopoverBase>
      )}
    </>
  );
};

export default PermissionsPageFilter;
