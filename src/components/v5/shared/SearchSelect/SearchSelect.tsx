import React, {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { debounce } from 'lodash';
import { useIntl } from 'react-intl';

import { SearchSelectProps } from './types';
import Card from '../Card';
import CustomScrollbar from '../CustomScrollbar';
import { useMobile } from '~hooks';
import Modal from '../Modal';
import { useSearchSelect } from './hooks';
import SearchInput from './partials/SearchInput';
import SearchItem from './partials/SearchItem';
import { accordionAnimation } from '~constants/accordionAnimation';
import Icon from '~shared/Icon';
import { SpinnerLoader } from '~shared/Preloaders';
import EmptyContent from '~v5/common/EmptyContent';

const displayName = 'v5.SearchSelect';

const SearchSelect = React.forwardRef<HTMLDivElement, SearchSelectProps>(
  ({ items, onToggle, isOpen, onSelect, isLoading }, ref) => {
    const [searchValue, setSearchValue] = useState('');
    const isMobile = useMobile();
    const { formatMessage } = useIntl();
    const filteredList = useSearchSelect(items, searchValue);

    const defaultOpenedAccordions = useMemo(
      () =>
        items.filter(({ isAccordion }) => isAccordion).map(({ key }) => key),
      [items],
    );

    const [openedAccordions, setOpenedAccordions] = useState<string[]>(
      defaultOpenedAccordions,
    );

    const handleSearch = useMemo(
      () => debounce(setSearchValue, 500),
      [setSearchValue],
    );

    const onInput: ChangeEventHandler<HTMLInputElement> = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const { value: inputValue } = e.target;

        handleSearch(inputValue);
      },
      [handleSearch],
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
        <div className="mb-6">
          <SearchInput onInput={onInput} />
        </div>
        {isLoading && (
          <div className="flex justify-center h-5">
            <SpinnerLoader appearance={{ size: 'medium' }} />
          </div>
        )}
        {!isLoading && (
          <CustomScrollbar height={600} mobileHeight="70vh">
            <div className="pr-4 sm:pr-0">
              {filteredList.length > 0 ? (
                filteredList.map(({ options, title, isAccordion, key }) =>
                  isAccordion ? (
                    <div className="mb-6 last:mb-0" key={key}>
                      <div className="flex items-center justify-between">
                        <h5 className="text-4 text-gray-400 mb-2 uppercase">
                          {formatMessage(title)}
                        </h5>
                        {isAccordion && (
                          <button
                            type="button"
                            onClick={() => handleAccordionClick(key)}
                          >
                            <Icon
                              name={
                                openedAccordions.includes(key)
                                  ? 'caret-up'
                                  : 'caret-down'
                              }
                              appearance={{ size: 'extraTiny' }}
                            />
                          </button>
                        )}
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
                            <SearchItem options={options} onChange={onSelect} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div key={key} className="mb-6 last:mb-0">
                      <h5 className="text-4 text-gray-400 mb-2 uppercase">
                        {formatMessage(title)}
                      </h5>
                      <SearchItem options={options} onChange={onSelect} />
                    </div>
                  ),
                )
              ) : (
                <EmptyContent
                  icon="binoculars"
                  title={{ id: 'actionSidebar.emptyTitle' }}
                  description={{ id: 'actionSidebar.emptyDescription' }}
                />
              )}
            </div>
          </CustomScrollbar>
        )}
      </>
    );

    return isMobile ? (
      <Modal isOpen={isOpen} onClose={onToggle} isFullOnMobile={false}>
        <div ref={ref}>{content}</div>
      </Modal>
    ) : (
      <Card
        className="py-4 px-2.5 w-full sm:max-w-[20.375rem] absolute top-[calc(100%+0.5rem)] left-0 z-50"
        hasShadow
        rounded="s"
        ref={ref}
      >
        {content}
      </Card>
    );
  },
);

SearchSelect.displayName = displayName;

export default SearchSelect;
