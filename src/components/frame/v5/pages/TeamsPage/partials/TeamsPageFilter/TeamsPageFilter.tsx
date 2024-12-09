import { MagnifyingGlass } from '@phosphor-icons/react';
import React, { type FC, useCallback, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useMobile } from '~hooks';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import SearchInputMobile from '~v5/common/Filter/partials/SearchInput/SearchInput.tsx';
import SearchPill from '~v5/common/Pills/SearchPill/SearchPill.tsx';
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
  const [isSearchOpened, setIsSearchOpened] = useState(false);
  const { getTooltipProps, setTooltipRef, setTriggerRef } = usePopperTooltip({
    delayShow: 200,
    delayHide: 200,
    placement: 'bottom-end',
    trigger: 'click',
    interactive: true,
    visible: isSearchOpened,
    onVisibleChange: setIsSearchOpened,
  });
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();
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
      <div className="flex flex-col items-start gap-2">
        <div className="flex flex-row gap-2">
          {!!searchValue && !isMobile && (
            <SearchPill value={searchValue} onClick={() => onSearch('')} />
          )}
          <FilterButton
            isOpen={isSearchOpened}
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
          <Button
            onClick={() =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: Action.CreateNewTeam,
              })
            }
            text={formatText({ id: 'teamsPage.createNewTeam' })}
            mode="primarySolid"
            size="small"
          />
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
          classNames="w-full sm:max-w-[20.375rem]"
        >
          <div className="mb-6 px-3.5">
            <SearchInputDesktop
              onChange={onInputChange}
              onClose={() => setIsSearchOpened(false)}
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
