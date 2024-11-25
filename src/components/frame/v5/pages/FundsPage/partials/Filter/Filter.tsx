import { MagnifyingGlass, X } from '@phosphor-icons/react';
import React, { useCallback, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useMobile } from '~hooks/index.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { formatMessage } from '~utils/yup/tests/helpers.ts';
import SearchInputMobile from '~v5/common/Filter/partials/SearchInput/SearchInput.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import FilterButton from '~v5/shared/Filter/FilterButton.tsx';
import Modal from '~v5/shared/Modal/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';
import SearchInputDesktop from '~v5/shared/SearchSelect/partials/SearchInput/index.ts';
import Header from '~v5/shared/SubNavigationItem/partials/Header.tsx';

import FilterItem from './FilterItem.tsx';
import { type FilterProps, type FilterValue } from './types.ts';

const displayName = 'v5.pages.FundsPage.partials.Filter';

function Filter<TValue extends FilterValue>({
  items: rootItems,
  onChange,
  value,
  onSearch,
  searchValue,
  searchInputLabel,
  searchInputPlaceholder,
  filtersHeader = 'filters',
  buttonText,
}: FilterProps<TValue>) {
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
  const isMobile = useMobile();
  const [isModalOpen, { toggleOff: toggleModalOff, toggleOn: toggleModalOn }] =
    useToggle();

  const onInputChange = useCallback(
    (inputValue: string) => {
      onSearch(inputValue);
    },
    [onSearch],
  );

  const RootItems = rootItems.map(({ icon, items, label, name, title }) => (
    <FilterItem
      key={name.toString()}
      label={label}
      icon={icon}
      title={title}
      name={name}
      items={items}
      path={name.toString()}
      value={value}
      onChange={onChange}
    />
  ));

  const filterCount = Object.values(value).reduce((acc, obj) => {
    return acc + Object.values(obj).filter((item) => item === true).length;
  }, 0);

  const searchPill = (
    <div className="flex items-center justify-end rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-400">
      <p className="max-w-[12.5rem] truncate sm:max-w-full">{searchValue}</p>
      <button
        type="button"
        onClick={() => onSearch('')}
        className="ml-2 flex-shrink-0"
      >
        <X size={12} className="text-inherit" />
      </button>
    </div>
  );

  return (
    <>
      <div className="flex flex-row gap-2">
        {!!searchValue && !isMobile && searchPill}
        <FilterButton
          isOpen={isSearchOpened}
          onClick={toggleModalOn}
          setTriggerRef={setTriggerRef}
          customLabel={buttonText}
          numberSelectedFilters={isMobile ? filterCount : undefined}
        />
        {isMobile && (
          <Button
            mode="tertiary"
            className="flex sm:hidden"
            size="small"
            aria-label={formatMessage({ id: 'ariaLabel.openSearchModal' })}
            onClick={() => setIsSearchOpened(true)}
          >
            <MagnifyingGlass size={14} />
          </Button>
        )}
        {!!searchValue && isMobile && searchPill}
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
              {searchInputLabel}
            </p>
            <div className="sm:mb-6 sm:px-3.5">
              <SearchInputMobile
                onSearchButtonClick={() => setIsSearchOpened(false)}
                setSearchValue={onInputChange}
                searchValue={searchValue}
                searchInputPlaceholder={searchInputPlaceholder}
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
              placeholder={searchInputPlaceholder}
              value={searchValue}
            />
          </div>
          <Header title={{ id: filtersHeader }} className="pb-2" />
          {RootItems}
        </PopoverBase>
      )}
    </>
  );
}

Filter.displayName = displayName;

export default Filter;
