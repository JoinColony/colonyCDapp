import { Binoculars } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { useMobile } from '~hooks/index.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import MenuContainer from '~v5/shared/MenuContainer/index.ts';
import Portal from '~v5/shared/Portal/index.ts';

import { useAccordion, useFilterItems, useSearch } from './hooks.ts';
import { SearchGroup } from './partials/SearchGroup/SearchGroup.tsx';
import SearchInput from './partials/SearchInput/index.ts';
import { type SearchSelectProps } from './types.ts';

const displayName = 'v5.SearchSelect';

const SearchSelectInner = <T,>(
  {
    items,
    onSelect,
    isLoading,
    hideSearchOnMobile,
    onSearch,
    onDebouncedSearch,
    showEmptyContent = true,
    showSearchValueAsOption = false,
    emptyContent,
    state,
    message,
    checkboxesList,
    additionalButtons,
    className,
    placeholder,
    renderOption,
  }: SearchSelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  const isMobile = useMobile();

  const { openedAccordions, onAccordionClick } = useAccordion(items);
  const { searchValue, debouncedSearchValue, onChange } = useSearch(
    '',
    onSearch,
    onDebouncedSearch,
  );
  const filteredList = useFilterItems(items, debouncedSearchValue, showSearchValueAsOption);

  const contentFallback =
    showEmptyContent &&
    (emptyContent || (
      <EmptyContent
        icon={Binoculars}
        title={{ id: 'actionSidebar.emptyTitle' }}
        description={{ id: 'actionSidebar.emptyDescription' }}
      />
    ));

  const content = (
    <>
      <div
        className={clsx('px-3.5', {
          'mb-5': filteredList.length > 0 || showEmptyContent,
        })}
      >
        {isMobile && hideSearchOnMobile ? (
          <p className="uppercase text-gray-400 text-4">
            {formatText({ id: 'actions.selectActionType' })}
          </p>
        ) : (
          <SearchInput
            onChange={onChange}
            state={state}
            message={message}
            value={searchValue}
            placeholder={
              placeholder ??
              formatText({
                id: 'placeholder.search',
              })
            }
          />
        )}
      </div>
      {isLoading && (
        <div className="flex h-5 justify-center">
          <SpinnerLoader appearance={{ size: 'medium' }} />
        </div>
      )}
      {!isLoading && (
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-1.5 pr-1 sm:max-h-none sm:w-full">
          <div>
            {filteredList.length > 0
              ? filteredList.map(({ key, ...rest }) => (
                  <SearchGroup
                    {...rest}
                    key={key}
                    onClick={() => onAccordionClick(key)}
                    onSelect={onSelect}
                    isOpen={openedAccordions.includes(key)}
                    renderOption={renderOption}
                    checkboxesList={checkboxesList}
                  />
                ))
              : contentFallback}
          </div>
        </div>
      )}
    </>
  );

  return (
    <Portal>
      <MenuContainer
        className={clsx(
          className,
          'absolute z-dropdown max-h-[37.5rem] w-full max-w-[calc(100%-2.25rem)] bg-base-white px-2.5 py-6 sm:max-w-[20.375rem]',
        )}
        hasShadow
        rounded="s"
        ref={ref}
      >
        {content}
        {additionalButtons}
      </MenuContainer>
    </Portal>
  );
};

const SearchSelect = React.forwardRef(SearchSelectInner) as <T>(
  props: SearchSelectProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof SearchSelectInner>;

(SearchSelect as FC).displayName = displayName;

export default SearchSelect;
