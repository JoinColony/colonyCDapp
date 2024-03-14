import { MagnifyingGlass } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useState, type FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import SearchInput from '~v5/common/Filter/partials/SearchInput/index.ts';
import Button from '~v5/shared/Button/Button.tsx';
import FilterButton from '~v5/shared/Filter/FilterButton.tsx';
import Modal from '~v5/shared/Modal/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import { useFiltersContext } from '../../FiltersContext/FiltersContext.ts';
import ActiveFiltersList from '../ActiveFiltersList/ActiveFiltersList.tsx';
import AgreementsPageFiltersItem from '../AgreementsPageFiltersItem/index.ts';

import { filterItems } from './consts.tsx';

const AgreementsPageFilters: FC = () => {
  const { searchFilter, setSearchFilter, selectedFiltersCount } =
    useFiltersContext();
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
        id: 'agreementsPage.filter.searchPlaceholder',
      })}
    />
  );
  const FiltersContent = (
    <div>
      <h4
        className={clsx('sm:px-4 mb-6 sm:mb-0', {
          'text-gray-400 text-4 uppercase': !isMobile,
          'heading-5 text-gray-900 capitalize': isMobile,
        })}
      >
        {formatText({ id: isMobile ? 'filterAndSort' : 'filters' })}
      </h4>
      <ul className="flex flex-col gap-7 sm:gap-0">
        {filterItems.map(({ icon, label, children }) => (
          <li key={label}>
            <AgreementsPageFiltersItem label={label} icon={icon}>
              {children}
            </AgreementsPageFiltersItem>
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
            className="sm:hidden flex h-9"
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
            <p className="text-4 text-gray-400 mb-4 uppercase">
              {formatText({ id: 'agreementsPage.filter.searchPlaceholder' })}
            </p>
            <div className="sm:px-3.5 sm:mb-6">{SearchInputComponent}</div>
          </Modal>
        </div>
      ) : (
        <>
          <div className="flex flex-row justify-end items-start gap-2">
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
              classNames="sm:min-w-[20.375rem]"
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

export default AgreementsPageFilters;
