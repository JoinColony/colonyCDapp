import { MagnifyingGlass, CaretDown } from '@phosphor-icons/react';
import React, { type FC, useCallback, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { type ModelSortDirection } from '~gql';
import { useMobile } from '~hooks';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';
import SearchInputMobile from '~v5/common/Filter/partials/SearchInput/SearchInput.tsx';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem/index.ts';
import Button from '~v5/shared/Button/index.ts';
import FilterButton from '~v5/shared/Filter/FilterButton.tsx';
import Modal from '~v5/shared/Modal/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';
import SearchInputDesktop from '~v5/shared/SearchSelect/partials/SearchInput/index.ts';
import Header from '~v5/shared/SubNavigationItem/partials/Header.tsx';

import { type TeamsPageFiltersField } from '../../types.ts';

import {
  type TeamsPageFilterRootProps,
  type TeamsPageFilterProps,
} from './types.ts';

const RootFilter: FC<TeamsPageFilterRootProps> = ({
  icon: Icon,
  name,
  label,
  title,
  items,
  onChange,
  filterValue,
}) => {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      delayShow: 200,
      delayHide: 200,
      placement: 'left-start',
      interactive: true,
    });
  const isMobile = useMobile();
  const [isAccordionOpen, { toggle: toggleAccordion }] = useToggle({
    defaultToggleState: true,
  });

  return (
    <>
      {isMobile ? (
        <AccordionItem
          isOpen={isAccordionOpen}
          onToggle={toggleAccordion}
          title={title}
          icon={CaretDown}
          iconSize={16}
          className="[&_.accordion-toggler]:text-gray-400 [&_.accordion-toggler]:mb-2 sm:[&_.accordion-toggler]:mb-0 [&_.accordion-toggler]:text-4 [&_.accordion-toggler]:uppercase sm:[&_.accordion-toggler]:px-3.5 [&_.accordion-icon]:text-gray-700 mb-4 last:mb-0"
        >
          {items.map(({ value, label: checkboxLabel }) => (
            <Checkbox
              isChecked={
                filterValue.field === name && filterValue.direction === value
              }
              onChange={() => {
                onChange({
                  field: name,
                  direction: value,
                });
              }}
              classNames="subnav-button px-0 sm:px-3.5"
            >
              {checkboxLabel}
            </Checkbox>
          ))}
        </AccordionItem>
      ) : (
        <>
          <button
            type="button"
            className="subnav-button gap-3 px-0 sm:px-3.5"
            ref={setTriggerRef}
          >
            <Icon size={14} />
            {label}
          </button>
          {visible && (
            <PopoverBase
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              withTooltipStyles={false}
              cardProps={{
                rounded: 's',
                hasShadow: true,
                className: 'py-6 px-2',
              }}
              classNames="w-full sm:max-w-[13.25rem] mr-2"
            >
              <>
                <span className="text-4 text-gray-400 px-3.5 uppercase">
                  {title}
                </span>
                {items.map(({ value, label: checkboxLabel }) => (
                  <Checkbox
                    isChecked={
                      filterValue.field === name &&
                      filterValue.direction === value
                    }
                    onChange={() => {
                      onChange({
                        field: name as TeamsPageFiltersField,
                        direction: value as ModelSortDirection,
                      });
                    }}
                    classNames="subnav-button px-0 sm:px-3.5"
                  >
                    {checkboxLabel}
                  </Checkbox>
                ))}
              </>
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
};

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
      <RootFilter
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
            <>
              <Header title={{ id: 'filters' }} />
              {RootItems}
            </>
          </Modal>
          <Modal
            isFullOnMobile={false}
            onClose={() => setIsSearchOpened(false)}
            isOpen={isSearchOpened}
          >
            <p className="text-4 text-gray-400 mb-4 uppercase">
              {formatText({ id: 'teamsPage.filter.search' })}
            </p>
            <div className="sm:px-3.5 sm:mb-6">
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
          <div className="px-3.5 mb-6">
            <SearchInputDesktop
              onChange={onInputChange}
              placeholder={formatText({ id: 'teamsPage.filter.search' })}
              value={searchValue}
            />
          </div>
          <Header
            title={{
              id: !isMobile ? 'teamsPage.filter.sortBy' : undefined,
            }}
          />
          {RootItems}
        </PopoverBase>
      )}
    </>
  );
};

export default TeamsPageFilter;
