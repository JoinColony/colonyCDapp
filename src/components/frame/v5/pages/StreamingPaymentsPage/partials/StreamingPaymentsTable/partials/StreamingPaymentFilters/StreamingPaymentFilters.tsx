import { MagnifyingGlass } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useState, type FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useStreamingFiltersContext } from '~frame/v5/pages/StreamingPaymentsPage/partials/StreamingPaymentsTable/FiltersContext/StreamingFiltersContext.ts';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import SearchInput from '~v5/common/Filter/partials/SearchInput/index.ts';
import Button from '~v5/shared/Button/Button.tsx';
import FilterButton from '~v5/shared/Filter/FilterButton.tsx';
import Modal from '~v5/shared/Modal/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import ActiveFiltersList from '../ActiveFiltersList/ActiveFiltersList.tsx';
import StreamingPaymentFiltersItem from '../StreamingPaymentPageFiltersItem/StreamingPaymentPageFiltersItem.tsx';

import { filterItems, sortItems } from './consts.tsx';

const StreamingPaymentPageFilters: FC = () => {
  const { searchFilter, setSearchFilter, selectedFiltersCount } =
    useStreamingFiltersContext();
  const [isOpened, setOpened] = useState(false);
  const [isSearchOpened, setIsSearchOpened] = useState(false);
  const isMobile = useMobile();
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      delayShow: 200,
      delayHide: 200,
      placement: 'bottom-start',
      trigger: 'click',
      interactive: true,
    });

  const SearchInputComponent = (
    <SearchInput
      onSearchButtonClick={() => setIsSearchOpened(false)}
      searchValue={searchFilter}
      setSearchValue={setSearchFilter}
      searchInputPlaceholder={formatText({
        id: 'streamingPayment.table.filter.searchPlaceholder',
      })}
    />
  );
  const FiltersContent = (
    <div>
      <h4
        className={clsx('mb-6 pb-2 sm:mb-0 sm:px-4', {
          'uppercase text-gray-400 text-4': !isMobile,
          'capitalize text-gray-900 heading-5': isMobile,
        })}
      >
        {formatText({ id: isMobile ? 'filterAndSort' : 'filters' })}
      </h4>
      <ul className="flex flex-col gap-7 sm:gap-0">
        {filterItems.map(({ icon, label, children }) => (
          <li key={label}>
            <StreamingPaymentFiltersItem label={label} icon={icon}>
              {children}
            </StreamingPaymentFiltersItem>
          </li>
        ))}
        <li className="hidden sm:block">
          <h4 className="pb-2 pt-2 uppercase text-gray-400 text-4 sm:px-4">
            {formatText({ id: 'streamingPayment.table.filter.sortBy' })}
          </h4>
        </li>
        {sortItems.map(({ icon, label, children }) => (
          <li key={label}>
            <StreamingPaymentFiltersItem label={label} icon={icon}>
              {children}
            </StreamingPaymentFiltersItem>
          </li>
        ))}
      </ul>
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
            className="flex h-9 sm:hidden"
            size="small"
            aria-label={formatText({ id: 'ariaLabel.openSearchModal' })}
            onClick={() => setIsSearchOpened(true)}
          >
            <MagnifyingGlass size={14} />
          </Button>
          <Modal
            isFullOnMobile={false}
            onClose={() => setOpened(false)}
            isOpen={isOpened}
          >
            {FiltersContent}
          </Modal>
          <Modal
            isFullOnMobile={false}
            onClose={() => setIsSearchOpened(false)}
            isOpen={isSearchOpened}
          >
            <p className="mb-4 uppercase text-gray-400 text-4">
              {formatText({
                id: 'streamingPayment.table.filter.searchPlaceholder',
              })}
            </p>
            <div className="sm:mb-6 sm:px-3.5">{SearchInputComponent}</div>
          </Modal>
        </div>
      ) : (
        <>
          <div className="flex flex-row items-start justify-end gap-2">
            <ActiveFiltersList />
            <FilterButton
              isOpen={visible}
              setTriggerRef={setTriggerRef}
              customLabel={formatText({ id: 'allFilters' })}
            />
          </div>
          {visible && (
            <PopoverBase
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              withTooltipStyles={false}
              cardProps={{
                rounded: 's',
                hasShadow: true,
                className: 'pt-6 pb-4 px-2',
              }}
              className="sm:min-w-[20.375rem]"
            >
              <div className="mb-6 px-4">{SearchInputComponent}</div>
              {FiltersContent}
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
};

export default StreamingPaymentPageFilters;
