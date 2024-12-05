import { MagnifyingGlass } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useState, type FC } from 'react';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useFiltersContext } from '~frame/v5/pages/AgreementsPage/FiltersContext/FiltersContext.ts';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import { useSearchFilter } from '~v5/common/Filter/hooks.ts';
import SearchInput from '~v5/common/Filter/partials/SearchInput/index.ts';
import SearchPill from '~v5/common/Pills/SearchPill/SearchPill.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import FilterButton from '~v5/shared/Filter/FilterButton.tsx';
import Modal from '~v5/shared/Modal/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import ActiveFiltersList from '../ActiveFiltersList/ActiveFiltersList.tsx';
import AgreementsPageFiltersItem from '../AgreementsPageFiltersItem/index.ts';

import { filterItems } from './consts.tsx';

const AgreementsPageFilters: FC = () => {
  const { searchFilter, setSearchFilter, selectedFiltersCount } =
    useFiltersContext();
  const [isOpened, setOpened] = useState(false);
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();
  const isMobile = useMobile();
  const {
    isSearchOpened,
    openSearch,
    closeSearch,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
  } = useSearchFilter();

  const SearchInputComponent = (
    <SearchInput
      onSearchButtonClick={closeSearch}
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
            <AgreementsPageFiltersItem label={label} icon={icon}>
              {children}
            </AgreementsPageFiltersItem>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="flex flex-row items-center gap-2">
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
              className="flex h-9 sm:hidden"
              size="small"
              aria-label={formatText({ id: 'ariaLabel.openSearchModal' })}
              onClick={openSearch}
            >
              <MagnifyingGlass size={14} />
            </Button>
            <Button
              mode="primarySolid"
              size="small"
              isFullSize={false}
              onClick={() => {
                toggleActionSidebarOn({
                  [ACTION_TYPE_FIELD_NAME]: Action.CreateDecision,
                });
              }}
            >
              {formatText({ id: 'agreementsPage.createAgreement' })}
            </Button>
            <Modal
              isFullOnMobile={false}
              onClose={() => setOpened(false)}
              isOpen={isOpened}
              withPaddingBottom
            >
              {FiltersContent}
            </Modal>
            <Modal
              isFullOnMobile={false}
              onClose={closeSearch}
              isOpen={isSearchOpened}
              withPaddingBottom
            >
              <p className="mb-4 uppercase text-gray-400 text-4">
                {formatText({ id: 'agreementsPage.filter.searchPlaceholder' })}
              </p>
              <div className="sm:mb-6 sm:px-3.5">{SearchInputComponent}</div>
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
            {!!searchFilter && (
              <SearchPill
                value={searchFilter}
                onClick={() => setSearchFilter('')}
              />
            )}
            <ActiveFiltersList />
            <FilterButton
              isOpen={isSearchOpened}
              setTriggerRef={setTriggerRef}
              customLabel={formatText({ id: 'allFilters' })}
            />
            <Button
              mode="primarySolid"
              size="small"
              isFullSize={false}
              onClick={() => {
                toggleActionSidebarOn({
                  [ACTION_TYPE_FIELD_NAME]: Action.CreateDecision,
                });
              }}
            >
              {formatText({ id: 'agreementsPage.createAgreement' })}
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
              <div className="mb-6 px-4">{SearchInputComponent}</div>
              {FiltersContent}
            </PopoverBase>
          )}
        </>
      )}
    </div>
  );
};

export default AgreementsPageFilters;
