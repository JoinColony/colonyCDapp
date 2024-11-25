import { MagnifyingGlass, X } from '@phosphor-icons/react';
import React, { type FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useFilterContext } from '~context/FilterContext/FilterContext.ts';
import { useSearchContext } from '~context/SearchContext/SearchContext.ts';
import { useMobile } from '~hooks/index.ts';
import Button from '~v5/shared/Button/index.ts';
import FilterButton from '~v5/shared/Filter/FilterButton.tsx';
import Modal from '~v5/shared/Modal/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import TableFiltering from '../TableFiltering/index.ts';

import FilterOptions from './partials/FilterOptions.tsx';
import SearchInput from './partials/SearchInput/index.ts';
import { type FilterProps } from './types.ts';

const displayName = 'v5.common.Filter';

const Filter: FC<FilterProps> = ({
  excludeFilterType,
  customLabel,
  searchInputLabel,
  searchInputPlaceholder,
}) => {
  const { formatMessage } = useIntl();
  const [isOpened, setOpened] = useState(false);
  const [isSearchOpened, setIsSearchOpened] = useState(false);
  const isMobile = useMobile();
  const { getTooltipProps, setTooltipRef, setTriggerRef } = usePopperTooltip({
    delayShow: 200,
    delayHide: 200,
    placement: 'bottom-end',
    trigger: 'click',
    interactive: true,
    visible: isSearchOpened,
    onVisibleChange: setIsSearchOpened,
  });

  const { selectedFilterCount } = useFilterContext();
  const { searchValue, setSearchValue } = useSearchContext();

  const searchPill = (
    <div className="flex items-center justify-end rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-400">
      <p className="max-w-[12.5rem] truncate sm:max-w-full">{searchValue}</p>
      <button
        type="button"
        onClick={() => setSearchValue('')}
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
            numberSelectedFilters={selectedFilterCount}
            customLabel={customLabel}
          />
          <Button
            mode="tertiary"
            className="flex sm:hidden"
            size="small"
            aria-label={formatMessage({ id: 'ariaLabel.openSearchModal' })}
            onClick={() => setIsSearchOpened(true)}
          >
            <MagnifyingGlass size={14} />
          </Button>
          {!!searchValue && searchPill}
          <Modal
            isFullOnMobile={false}
            onClose={() => setOpened(false)}
            isOpen={isOpened}
            withPaddingBottom
          >
            <FilterOptions excludeFilterType={excludeFilterType} />
          </Modal>
          <Modal
            isFullOnMobile={false}
            onClose={() => setIsSearchOpened(false)}
            isOpen={isSearchOpened}
            withPaddingBottom
          >
            <p className="mb-4 text-gray-400 text-4">{searchInputLabel}</p>
            <div className="sm:mb-6 sm:px-3.5">
              <SearchInput
                onSearchButtonClick={() => setIsSearchOpened(false)}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                searchInputPlaceholder={searchInputPlaceholder}
              />
            </div>
          </Modal>
        </div>
      ) : (
        <>
          <div className="flex flex-row gap-2">
            <TableFiltering />
            {!!searchValue && searchPill}
            <FilterButton
              isOpen={isSearchOpened}
              setTriggerRef={setTriggerRef}
              customLabel={customLabel}
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
                className: 'pt-6 pb-4 px-2.5',
              }}
              classNames="w-full sm:max-w-[17.375rem]"
            >
              <div className="sm:mb-6 sm:px-3.5">
                <SearchInput
                  onSearchButtonClick={() => setIsSearchOpened(false)}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  searchInputPlaceholder={searchInputPlaceholder}
                />
              </div>
              <FilterOptions excludeFilterType={excludeFilterType} />
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
};

Filter.displayName = displayName;

export default Filter;
