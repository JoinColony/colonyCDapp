import { MagnifyingGlass } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, useCallback } from 'react';

import { Action } from '~constants/actions.ts';
import {
  ActionSidebarMode,
  useActionSidebarContext,
} from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useMobile } from '~hooks';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import { useSearchFilter } from '~v5/common/Filter/hooks.ts';
import SearchInputMobile from '~v5/common/Filter/partials/SearchInput/SearchInput.tsx';
import SearchPill from '~v5/common/Pills/SearchPill/SearchPill.tsx';
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
    isSearchOpened,
    openSearch,
    closeSearch,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
  } = useSearchFilter();
  const { showActionSidebar } = useActionSidebarContext();
  const isMobile = useMobile();
  const [isModalOpen, { toggleOff: toggleModalOff, toggleOn: toggleModalOn }] =
    useToggle();
  const onInputChange = useCallback(
    (inputValue: string) => {
      onSearch(inputValue);
    },
    [onSearch],
  );

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
      <div
        className={clsx('flex flex-col', {
          'items-start gap-2': isMobile && searchValue,
        })}
      >
        <div className="flex flex-row gap-2">
          {!!searchValue && !isMobile && (
            <SearchPill value={searchValue} onClick={() => onSearch('')} />
          )}
          <FilterButton
            isOpen={isSearchOpened}
            onClick={toggleModalOn}
            setTriggerRef={setTriggerRef}
            customLabel={formatText({ id: 'allFilters' })}
            numberSelectedFilters={activeFiltersNumber}
          />
          {isMobile && (
            <Button
              mode="tertiary"
              className="flex sm:hidden"
              size="small"
              aria-label={formatText({ id: 'ariaLabel.openSearchModal' })}
              onClick={openSearch}
            >
              <MagnifyingGlass size={14} />
            </Button>
          )}
          <Button
            mode="primarySolid"
            size="small"
            isFullSize={false}
            onClick={() => {
              showActionSidebar(ActionSidebarMode.CreateAction, {
                action: Action.ManagePermissions,
              });
            }}
          >
            {formatText({ id: 'permissionsPage.managePermissions' })}
          </Button>
        </div>
        {!!searchValue && isMobile && (
          <SearchPill value={searchValue} onClick={() => onSearch('')} />
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
            <h4 className="mb-6 capitalize text-gray-900 heading-5 sm:mb-0 sm:px-4">
              {formatText({ id: 'filterAndSort' })}
            </h4>
            {RootItems}
          </Modal>
          <Modal
            isFullOnMobile={false}
            onClose={closeSearch}
            isOpen={isSearchOpened}
            withPaddingBottom
          >
            <p className="mb-4 uppercase text-gray-400 text-4">
              {formatText({ id: 'permissionsPage.filter.search' })}
            </p>
            <div className="sm:mb-6 sm:px-3.5">
              <SearchInputMobile
                onSearchButtonClick={closeSearch}
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
      {isSearchOpened && !isMobile && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={getTooltipProps}
          withTooltipStyles={false}
          cardProps={{
            rounded: 's',
            hasShadow: true,
            className: 'pt-6 pb-4 px-2.5',
          }}
          className="w-full sm:max-w-[20.375rem]"
        >
          <div className="mb-6 px-3.5">
            <SearchInputDesktop
              onChange={onInputChange}
              onClose={closeSearch}
              placeholder={formatText({ id: 'permissionsPage.filter.search' })}
              value={searchValue}
            />
          </div>
          <Header
            title={{ id: 'permissionsPage.filter.filterBy' }}
            className="pb-2"
          />
          {RootItems}
        </PopoverBase>
      )}
    </>
  );
};

export default PermissionsPageFilter;
