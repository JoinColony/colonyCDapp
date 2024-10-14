import { Binoculars, CaretDown, CaretUp } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import debounce from 'lodash/debounce';
import React, {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useMobile } from '~hooks/index.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import Portal from '~v5/shared/Portal/index.ts';

import MenuContainer from '../MenuContainer/index.ts';

import { useSearchSelect } from './hooks.ts';
import CheckboxSearchItem from './partials/CheckboxSearchItem/index.ts';
import SearchInput from './partials/SearchInput/index.ts';
import SearchItem from './partials/SearchItem/index.ts';
import { type SearchSelectProps } from './types.ts';

const displayName = 'v5.SearchSelect';

const SearchSelect = React.forwardRef<HTMLDivElement, SearchSelectProps>(
  (
    {
      items,
      onSelect,
      isLoading,
      hideSearchOnMobile,
      onSearch,
      showEmptyContent = true,
      state,
      message,
      checkboxesList,
      additionalButtons,
      className,
      placeholder,
    },
    ref,
  ) => {
    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
    const isMobile = useMobile();
    const filteredList = useSearchSelect(items, debouncedSearchValue);

    useEffect(() => {
      const debounceTimeout = setTimeout(() => {
        setDebouncedSearchValue(searchValue);
      }, 500);

      return () => clearTimeout(debounceTimeout);
    }, [searchValue]);

    const defaultOpenedAccordions = useMemo(
      () =>
        items.filter(({ isAccordion }) => isAccordion).map(({ key }) => key),
      [items],
    );

    const [openedAccordions, setOpenedAccordions] = useState<string[]>(
      defaultOpenedAccordions,
    );

    const handleSearch = useMemo(
      () => debounce(setDebouncedSearchValue, 500),
      [setDebouncedSearchValue],
    );

    const onChange = useCallback(
      (value: string) => {
        onSearch?.(value);
        setSearchValue(value);
        if (value) {
          handleSearch(value);
        } else {
          setDebouncedSearchValue('');
        }
      },
      [handleSearch, onSearch],
    );

    const handleAccordionClick = useCallback((key: string) => {
      setOpenedAccordions((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        }

        return [...prev, key];
      });
    }, []);

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
                ? filteredList.map(({ options, title, isAccordion, key }) =>
                    isAccordion ? (
                      <div className="mb-[0.625rem] last:mb-0" key={key}>
                        <div className="flex items-center justify-between px-2">
                          <h5 className="mb-2 uppercase text-gray-400 text-4">
                            {formatText(title)}
                          </h5>
                          <button
                            type="button"
                            className="flex h-4 w-4 items-end justify-center text-gray-700"
                            onClick={() => handleAccordionClick(key)}
                          >
                            <span className="text-gray-700 md:hover:text-blue-400">
                              {openedAccordions.includes(key) ? (
                                <CaretUp size={12} />
                              ) : (
                                <CaretDown size={12} />
                              )}
                            </span>
                          </button>
                        </div>
                        <AnimatePresence>
                          {openedAccordions.includes(key) && (
                            <motion.div
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              variants={accordionAnimation}
                              transition={{ duration: 0.4, ease: 'easeOut' }}
                              className="overflow-hidden"
                            >
                              {checkboxesList ? (
                                <CheckboxSearchItem
                                  options={options}
                                  onChange={onSelect}
                                  checkboxesList={checkboxesList}
                                />
                              ) : (
                                <SearchItem
                                  options={options}
                                  onChange={onSelect}
                                />
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <div key={key} className="mb-[0.625rem] last:mb-0">
                        <h5 className="mb-2 pl-2 uppercase text-gray-400 text-4">
                          {formatText(title)}
                        </h5>
                        {checkboxesList ? (
                          <CheckboxSearchItem
                            options={options}
                            onChange={onSelect}
                            checkboxesList={checkboxesList}
                          />
                        ) : (
                          <SearchItem options={options} onChange={onSelect} />
                        )}
                      </div>
                    ),
                  )
                : showEmptyContent && (
                    <EmptyContent
                      icon={Binoculars}
                      title={{ id: 'actionSidebar.emptyTitle' }}
                      description={{ id: 'actionSidebar.emptyDescription' }}
                    />
                  )}
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
  },
);

(SearchSelect as FC).displayName = displayName;

export default SearchSelect;
