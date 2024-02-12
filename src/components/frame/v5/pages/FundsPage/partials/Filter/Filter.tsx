import { CaretDown, MagnifyingGlass } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import React, { useCallback, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useMobile } from '~hooks/index.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { formatMessage } from '~utils/yup/tests/helpers.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';
import SearchInputMobile from '~v5/common/Filter/partials/SearchInput/SearchInput.tsx';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem/index.ts';
import Button from '~v5/shared/Button/Button.tsx';
import FilterButton from '~v5/shared/Filter/FilterButton.tsx';
import Modal from '~v5/shared/Modal/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';
import SearchInputDesktop from '~v5/shared/SearchSelect/partials/SearchInput/index.ts';
import Header from '~v5/shared/SubNavigationItem/partials/Header.tsx';

import {
  type RootFilterProps,
  type FilterProps,
  type FilterValue,
  type NestedFilterProps,
} from './types.ts';

const displayName = 'v5.pages.FundsPage.partials.Filter';

function NestedFilterItem<TValue extends FilterValue, TLevel extends number>({
  label,
  path,
  value,
  onChange,
  items: nestedItems,
}: NestedFilterProps<TValue, TLevel>) {
  const {
    getTooltipProps: getNestedTooltipProps,
    setTooltipRef: setNestedTooltipRef,
    setTriggerRef: setNestedTriggerRef,
  } = usePopperTooltip({
    delayShow: 200,
    delayHide: 200,
    placement: 'left-start',
    interactive: true,
  });
  const isChecked = !!get(value, path);
  const isMobile = useMobile();
  const NestedItems = nestedItems?.map(({ ...nestedItem }) => (
    // @ts-ignore
    <NestedFilterItem
      key={nestedItem.name}
      onChange={onChange}
      path={`${path}.${nestedItem.name}`}
      value={value}
      {...nestedItem}
    />
  ));

  return (
    <>
      {isMobile ? (
        <>
          <Checkbox
            isChecked={isChecked}
            onChange={(e) => {
              onChange(set(cloneDeep(value), path, e.target.checked));
            }}
            classNames="subnav-button px-0 sm:px-3.5"
          >
            {label}
          </Checkbox>
          {!!nestedItems?.length && (
            <AnimatePresence>
              {isChecked && (
                <motion.div
                  key="accordion-content"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={accordionAnimation}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="overflow-hidden pl-4"
                >
                  {NestedItems}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </>
      ) : (
        <>
          <div ref={setNestedTriggerRef}>
            <Checkbox
              isChecked={isChecked}
              onChange={(e) => {
                onChange(set(cloneDeep(value), path, e.target.checked));
              }}
              classNames="subnav-button px-0 sm:px-3.5"
            >
              {label}
            </Checkbox>
          </div>
          {!!nestedItems?.length && isChecked && (
            <PopoverBase
              setTooltipRef={setNestedTooltipRef}
              tooltipProps={getNestedTooltipProps}
              withTooltipStyles={false}
              cardProps={{
                rounded: 's',
                hasShadow: true,
                className: 'py-6 px-2',
              }}
              classNames="w-full sm:max-w-[13.25rem] mr-2"
            >
              {NestedItems}
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
}

function RootFilter<TValue extends FilterValue>({
  items,
  label,
  icon: Icon,
  onChange,
  path,
  value,
  title,
}: RootFilterProps<TValue>) {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      delayShow: 200,
      delayHide: 200,
      placement: 'left-start',
      interactive: true,
    });
  const isMobile = useMobile();
  const [isAccordionOpen, { toggle: toggleAccordion }] = useToggle();
  const RootItems = items.map(
    ({ label: nestedFilterItemLabel, name, items: nestedFilterItems }) => (
      <NestedFilterItem<TValue, 2>
        key={name.toString()}
        label={nestedFilterItemLabel}
        name={name}
        items={nestedFilterItems}
        onChange={onChange}
        value={value}
        path={`${path}.${name.toString()}`}
      />
    ),
  );

  return (
    <>
      {isMobile ? (
        <AccordionItem
          isOpen={isAccordionOpen}
          onToggle={toggleAccordion}
          title={title}
          icon={CaretDown}
          className="[&_.accordion-toggler]:text-gray-400 [&_.accordion-toggler]:text-4 [&_.accordion-toggler]:uppercase sm:[&_.accordion-toggler]:px-3.5 mb-4 last:mb-0"
        >
          {RootItems}
        </AccordionItem>
      ) : (
        <>
          <button
            type="button"
            className="subnav-button gap-3 px-0 sm:px-3.5"
            ref={setTriggerRef}
          >
            <Icon size={14} />
            {label}
          </button>
          {visible && (
            <PopoverBase
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              withTooltipStyles={false}
              cardProps={{
                rounded: 's',
                hasShadow: true,
                className: 'py-6 px-2',
              }}
              classNames="w-full sm:max-w-[13.25rem] mr-2"
            >
              <>
                <span className="text-4 text-gray-400 px-3.5 uppercase">
                  {title}
                </span>
                {RootItems}
              </>
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
}

function Filter<TValue extends FilterValue>({
  items: rootItems,
  onChange,
  value,
  onSearch,
  searchValue,
  searchInputLabel,
  searchInputPlaceholder,
}: FilterProps<TValue>) {
  const {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible: isFiltersOpen,
  } = usePopperTooltip({
    delayShow: 200,
    delayHide: 200,
    placement: 'bottom-end',
    trigger: 'click',
    interactive: true,
  });
  const isMobile = useMobile();
  const [isModalOpen, { toggleOff: toggleModalOff, toggleOn: toggleModalOn }] =
    useToggle();

  const onInputChange = useCallback(
    (inputValue: string) => {
      onSearch(inputValue);
    },
    [onSearch],
  );

  const RootItems = rootItems.map(({ icon, items, label, name, title }) => (
    <RootFilter
      key={name.toString()}
      label={label}
      icon={icon}
      title={title}
      name={name}
      items={items}
      path={name.toString()}
      value={value}
      onChange={onChange}
    />
  ));

  const [isSearchOpened, setIsSearchOpened] = useState(false);

  return (
    <>
      <div className="flex flex-row gap-2">
        <FilterButton
          isOpen={isFiltersOpen}
          onClick={toggleModalOn}
          setTriggerRef={setTriggerRef}
        />
        {isMobile && (
          <Button
            mode="tertiary"
            className="sm:hidden flex"
            size="small"
            aria-label={formatMessage({ id: 'ariaLabel.openSearchModal' })}
            onClick={() => setIsSearchOpened(true)}
          >
            <MagnifyingGlass size={14} />
          </Button>
        )}
      </div>
      {isMobile && (
        <>
          <Modal
            isOpen={isModalOpen}
            onClose={toggleModalOff}
            isFullOnMobile={false}
          >
            <>
              <Header title={{ id: 'filters' }} />
              {RootItems}
            </>
          </Modal>
          <Modal
            isFullOnMobile={false}
            onClose={() => setIsSearchOpened(false)}
            isOpen={isSearchOpened}
          >
            <p className="text-4 text-gray-400 mb-4">{searchInputLabel}</p>
            <div className="sm:px-3.5 sm:mb-6">
              <SearchInputMobile
                onSearchButtonClick={() => setIsSearchOpened(false)}
                setSearchValue={onInputChange}
                searchValue={searchValue}
                searchInputPlaceholder={searchInputPlaceholder}
              />
            </div>
          </Modal>
        </>
      )}
      {isFiltersOpen && !isMobile && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={getTooltipProps}
          withTooltipStyles={false}
          cardProps={{
            rounded: 's',
            hasShadow: true,
            className: 'pt-6 pb-4 px-2.5',
          }}
          classNames="w-full sm:max-w-[20.375rem]"
        >
          <div className="px-3.5 mb-6">
            <SearchInputDesktop onChange={onInputChange} value={searchValue} />
          </div>
          <Header title={{ id: 'filters' }} />
          {RootItems}
        </PopoverBase>
      )}
    </>
  );
}

Filter.displayName = displayName;

export default Filter;
