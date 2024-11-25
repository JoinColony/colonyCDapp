import { MagnifyingGlass, X } from '@phosphor-icons/react';
import React, { useState, type FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useFiltersContext } from '~common/ColonyActionsTable/FiltersContext/FiltersContext.ts';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import SearchInput from '~v5/common/Filter/partials/SearchInput/index.ts';
import Button from '~v5/shared/Button/Button.tsx';
import FilterButton from '~v5/shared/Filter/FilterButton.tsx';
import Modal from '~v5/shared/Modal/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import { filterItems } from './consts.tsx';
import ActionTableFiltersItem from './partials/ActionTableFiltersItem/index.ts';
import ActiveFiltersList from './partials/ActiveFiltersList/index.ts';

const ActionsTableFilters: FC = () => {
  const { searchFilter, setSearchFilter, selectedFiltersCount } =
    useFiltersContext();

  const [isOpened, setOpened] = useState(false);
  const [isSearchOpened, setIsSearchOpened] = useState(false);
  const isMobile = useMobile();
  const { getTooltipProps, setTooltipRef, setTriggerRef } = usePopperTooltip({
    delayShow: 200,
    delayHide: 200,
    placement: 'bottom-start',
    trigger: 'click',
    interactive: true,
    visible: isSearchOpened,
    onVisibleChange: setIsSearchOpened,
  });

  const filtersContent = (
    <div>
      <h4 className="mb-6 pb-2 text-gray-900 heading-5 sm:mb-0 sm:px-4 sm:uppercase sm:text-gray-400 sm:text-4">
        {formatText({ id: isMobile ? 'filterAndSort' : 'filters' })}
      </h4>
      <ul className="flex flex-col gap-7 sm:gap-0">
        {filterItems.map(({ icon, label, children }) => (
          <li key={label}>
            <ActionTableFiltersItem label={label} icon={icon}>
              {children}
            </ActionTableFiltersItem>
          </li>
        ))}
      </ul>
    </div>
  );

  const searchInput = (
    <SearchInput
      onSearchButtonClick={() => setIsSearchOpened(false)}
      searchValue={searchFilter}
      setSearchValue={setSearchFilter}
      searchInputPlaceholder={formatText({
        id: 'activityFeedTable.filters.searchPlaceholder',
      })}
    />
  );

  const searchPill = (
    <div className="flex items-center justify-end rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-400">
      <p className="max-w-[12.5rem] truncate sm:max-w-full">{searchFilter}</p>
      <button
        type="button"
        onClick={() => setSearchFilter('')}
        className="ml-2 flex-shrink-0"
      >
        <X size={12} className="text-inherit" />
      </button>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <div className="flex items-center gap-2">
          <FilterButton
            isOpen={isOpened}
            onClick={() => setOpened(!isOpened)}
            numberSelectedFilters={selectedFiltersCount}
            customLabel={formatText({ id: 'allFilters' })}
          />
          <Button
            mode="tertiary"
            className="flex sm:hidden"
            size="small"
            aria-label={formatText({ id: 'ariaLabel.openSearchModal' })}
            onClick={() => setIsSearchOpened(true)}
          >
            <MagnifyingGlass size={14} />
          </Button>
          {!!searchFilter && searchPill}
          <Modal
            isFullOnMobile={false}
            onClose={() => setOpened(false)}
            isOpen={isOpened}
            withPaddingBottom
          >
            {filtersContent}
          </Modal>
          <Modal
            isFullOnMobile={false}
            onClose={() => setIsSearchOpened(false)}
            isOpen={isSearchOpened}
            withPaddingBottom
          >
            <p className="mb-4 uppercase text-gray-400 text-4">
              {formatText({ id: 'activityFeedTable.filters.searchModalTitle' })}
            </p>
            <div className="sm:mb-6 sm:px-3.5">{searchInput}</div>
          </Modal>
        </div>
      ) : (
        <>
          <div className="flex flex-row items-start justify-end gap-2">
            <ActiveFiltersList />
            {!!searchFilter && searchPill}
            <FilterButton
              isOpen={isSearchOpened}
              setTriggerRef={setTriggerRef}
              onClick={() => setIsSearchOpened((prev) => !prev)}
              customLabel={formatText({ id: 'allFilters' })}
            />
          </div>
          {isSearchOpened && (
            <PopoverBase
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              withTooltipStyles={false}
              cardProps={{
                rounded: 's',
                hasShadow: true,
                className: 'pt-6 pb-4 px-2',
              }}
              classNames="sm:min-w-[20.375rem]"
            >
              <div className="mb-6 px-4">{searchInput}</div>
              {filtersContent}
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
};

export default ActionsTableFilters;
