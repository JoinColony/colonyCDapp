import React, {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOnClickOutside } from 'usehooks-ts';
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
import Icon from '~shared/Icon/';

const displayName = 'v5.SearchSelect';

const SearchSelect: FC<SearchSelectProps> = ({ items, onToggle, isOpen }) => {
  const [searchValue, setSearchValue] = useState('');
  const isMobile = useMobile();
  const { formatMessage } = useIntl();
  const ref = useRef(null);
  const filteredList = useSearchSelect(items, searchValue);

  const defaultOpenedAccordions = useMemo(
    () => items.filter(({ isAccordion }) => isAccordion).map(({ key }) => key),
    [items],
  );

  const [openedAccordions, setOpenedAccordions] = useState<string[]>(
    defaultOpenedAccordions,
  );

  useOnClickOutside(ref, () => {
    setSearchValue('');
    onToggle();
  });

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
      <CustomScrollbar height={600} mobileHeight="70vh">
        <div className="pr-4 sm:pr-0">
          {filteredList.map(({ options, title, isAccordion, key }) =>
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
                      <SearchItem options={options} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div key={key} className="mb-6 last:mb-0">
                <SearchItem options={options} />
              </div>
            ),
          )}
        </div>
      </CustomScrollbar>
    </>
  );

  return isMobile ? (
    <Modal isOpen={isOpen} onClose={onToggle} isFullOnMobile={false}>
      <div ref={ref}>{content}</div>
    </Modal>
  ) : (
    <Card
      className="py-4 px-2.5 w-full sm:max-w-[20.375rem] absolute top-full right-1/2 translate-x-1/2"
      hasShadow
      rounded="s"
      ref={ref}
    >
      {content}
    </Card>
  );
};

SearchSelect.displayName = displayName;

export default SearchSelect;
