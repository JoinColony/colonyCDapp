import { MagnifyingGlass } from '@phosphor-icons/react';
import React, { useState, type FC } from 'react';

import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import { useSearchFilter } from '~v5/common/Filter/hooks.ts';
import SearchInput from '~v5/common/Filter/partials/SearchInput/index.ts';
import SearchPill from '~v5/common/Pills/SearchPill/SearchPill.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import FilterButton from '~v5/shared/Filter/FilterButton.tsx';
import Modal from '~v5/shared/Modal/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import { useFiltersContext } from '../FiltersContext/FiltersContext.ts';
import ActiveFiltersList from '../partials/ActiveFiltersList/ActiveFiltersList.tsx';
import BalanceTableFiltersItem from '../partials/BalanceTableFiltersItem/BalanceTableFiltersItem.tsx';

import { filterItems } from './consts.tsx';

interface BalanceFiltersProps {
  toggleAddFundsModalOn: () => void;
}

const BalanceFilters: FC<BalanceFiltersProps> = ({ toggleAddFundsModalOn }) => {
  const { searchFilter, setSearchFilter, selectedFiltersCount } =
    useFiltersContext();

  const [isOpened, setOpened] = useState(false);
  const isMobile = useMobile();
  const {
    isSearchOpened,
    openSearch,
    closeSearch,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
  } = useSearchFilter();

  const filtersContent = (
    <div>
      <h4 className="mb-6 pb-2 text-gray-900 heading-5 sm:mb-0 sm:px-4 sm:uppercase sm:text-gray-400 sm:text-4">
        {formatText({ id: isMobile ? 'filterAndSort' : 'filters' })}
      </h4>
      <ul className="flex flex-col gap-7 sm:gap-0">
        {filterItems.map(({ icon, label, children }) => (
          <li key={label}>
            <BalanceTableFiltersItem label={label} icon={icon}>
              {children}
            </BalanceTableFiltersItem>
          </li>
        ))}
      </ul>
    </div>
  );

  const searchInput = (
    <SearchInput
      onSearchButtonClick={closeSearch}
      searchValue={searchFilter}
      setSearchValue={setSearchFilter}
      searchInputPlaceholder={formatText({
        id: 'balancePage.filter.search',
      })}
    />
  );

  return (
    <div className="mr-2">
      {isMobile ? (
        <div className="flex flex-col items-start gap-2">
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
              onClick={openSearch}
            >
              <MagnifyingGlass size={14} />
            </Button>
            <Button
              mode="primarySolid"
              onClick={toggleAddFundsModalOn}
              size="small"
            >
              {formatText({ id: 'balancePage.table.addFunds' })}
            </Button>
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
              onClose={closeSearch}
              isOpen={isSearchOpened}
              withPaddingBottom
            >
              <p className="mb-4 uppercase text-gray-400 text-4">
                {formatText({ id: 'balancePage.filter.searchModalTitle' })}
              </p>
              <div className="sm:mb-6 sm:px-3.5">{searchInput}</div>
            </Modal>
          </div>
          {!!searchFilter && (
            <SearchPill
              value={searchFilter}
              onClick={() => setSearchFilter('')}
            />
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-row items-start justify-end gap-2">
            <ActiveFiltersList />
            {!!searchFilter && (
              <SearchPill
                value={searchFilter}
                onClick={() => setSearchFilter('')}
              />
            )}
            <FilterButton
              isOpen={isSearchOpened}
              setTriggerRef={setTriggerRef}
              customLabel={formatText({ id: 'allFilters' })}
            />
            <Button
              mode="primarySolid"
              onClick={toggleAddFundsModalOn}
              size="small"
            >
              {formatText({ id: 'balancePage.table.addFunds' })}
            </Button>
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
    </div>
  );
};

export default BalanceFilters;
