import React, { useCallback } from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import { usePopperTooltip } from 'react-popper-tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '~shared/Icon';
import Checkbox from '~v5/common/Checkbox';
import FilterButton from '~v5/shared/Filter/FilterButton';
import PopoverBase from '~v5/shared/PopoverBase';
import {
  RootFilterProps,
  FilterProps,
  FilterValue,
  NestedFilterProps,
} from './types';
import { useMobile } from '~hooks';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem';
import useToggle from '~hooks/useToggle';
import { accordionAnimation } from '~constants/accordionAnimation';
import Modal from '~v5/shared/Modal';
import Header from '~v5/shared/SubNavigationItem/partials/Header';
import SearchInput from '~v5/shared/SearchSelect/partials/SearchInput';

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
  iconName,
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
          iconName="chevron-down"
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
            <Icon name={iconName} appearance={{ size: 'tiny' }} />
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

  const RootItems = rootItems.map(({ iconName, items, label, name, title }) => (
    <RootFilter
      key={name.toString()}
      label={label}
      iconName={iconName}
      title={title}
      name={name}
      items={items}
      path={name.toString()}
      value={value}
      onChange={onChange}
    />
  ));

  return (
    <>
      <div className="flex flex-row gap-2">
        <FilterButton
          isOpen={isFiltersOpen}
          setTriggerRef={setTriggerRef}
          onClick={toggleModalOn}
        />
      </div>
      {isFiltersOpen && (
        <>
          {isMobile ? (
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
          ) : (
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
                <SearchInput
                  onChange={onInputChange}
                  value={searchValue}
                  shouldFocus
                />
              </div>
              <Header title={{ id: 'filters' }} />
              {RootItems}
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
}

Filter.displayName = displayName;

export default Filter;
