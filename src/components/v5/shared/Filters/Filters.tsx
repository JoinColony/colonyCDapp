import { DeepPartial } from 'utility-types';
import React, { Fragment, useCallback, useMemo } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { AnimatePresence, motion } from 'framer-motion';

import { X } from 'phosphor-react';
import { cloneDeep, get, omit, set, toPath } from '~utils/lodash';
import Icon from '~shared/Icon';
import Checkbox from '~v5/common/Checkbox';
import FilterButton from '~v5/shared/FilterButton/FilterButton';
import PopoverBase from '~v5/shared/PopoverBase';
import { useMobile } from '~hooks';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem';
import useToggle from '~hooks/useToggle';
import { accordionAnimation } from '~constants/accordionAnimation';
import Modal from '~v5/shared/Modal';
import Header from '~v5/shared/SubNavigationItem/partials/Header';
import SearchInput from '~v5/shared/SearchSelect/partials/SearchInput';

import {
  RootFilterProps,
  FiltersProps,
  FiltersValue,
  NestedFilterProps,
  RootPickedFilterProps,
  NestedPickedFilterProps,
} from './types';
import { countCheckedFilters, isAnyFilterChecked } from './utils';

const displayName = 'v5.Filters';

function NestedFilterItem<TValue extends FiltersValue, TLevel extends number>({
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
    visible: isNestedFilterOpen,
  } = usePopperTooltip({
    delayShow: 200,
    delayHide: 200,
    placement: 'left-start',
    interactive: true,
    trigger: 'hover',
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
  const checkbox = (
    <Checkbox
      isChecked={isChecked}
      onChange={(event) => {
        const { checked } = event.target;
        const parsedPath = toPath(path);
        const clonedValue = cloneDeep(value);

        set(clonedValue, path, checked);

        if (checked || parsedPath.length < 3) {
          onChange(clonedValue);

          return;
        }

        const parentPath = parsedPath.slice(0, -1);
        const parentValue = get(clonedValue, parentPath);

        if (!isAnyFilterChecked(parentValue)) {
          set(clonedValue, parentPath, true);
        }

        onChange(clonedValue);
      }}
      classNames="subnav-button px-0 sm:px-3.5"
    >
      {label}
    </Checkbox>
  );

  return (
    <>
      {isMobile ? (
        <>
          {checkbox}
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
          <div ref={setNestedTriggerRef}>{checkbox}</div>
          {!!nestedItems?.length && isNestedFilterOpen && isChecked && (
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

function RootFilter<TValue extends FiltersValue>({
  items,
  label,
  icon,
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
            {typeof icon === 'string' ? (
              <Icon name={icon} appearance={{ size: 'tiny' }} />
            ) : (
              icon
            )}
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

function PickedFilter<TValue extends FiltersValue, TLevel extends number>({
  value,
  items,
  label,
}: NestedPickedFilterProps<TValue, TLevel>) {
  const isNestedFilter = typeof value !== 'boolean';

  if (!isAnyFilterChecked(value)) {
    return null;
  }

  if (!isNestedFilter || !items) {
    return <span>{label}</span>;
  }

  return (
    <>
      <b className="font-semibold">{label}: </b>
      {items.map((nested) => (
        <Fragment key={nested.name}>
          <PickedFilter
            value={value[nested.name] as unknown as DeepPartial<TValue>}
            label={nested.label}
            items={nested.items}
          />
        </Fragment>
      ))}
    </>
  );
}

function RootPickedFilter<TValue extends FiltersValue>({
  items,
  value,
  label,
  onRemove,
}: RootPickedFilterProps<TValue>) {
  return (
    <div className="bg-blue-100 rounded-lg text-blue-400 px-3 py-2 flex gap-2 items-center text-sm max-w-full text-left">
      <div className="[&_span:not(:last-child)]:after:content-[',_'] font-medium line-clamp-1">
        <PickedFilter items={items} value={value} label={label} />
      </div>
      <button type="button" onClick={onRemove}>
        <X size={12} />
      </button>
    </div>
  );
}

function Filters<TValue extends FiltersValue>({
  items: rootItems,
  onChange,
  value,
  onSearch,
  searchValue,
  searchPlaceholder,
  customLabel,
}: FiltersProps<TValue>) {
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
  const activeRootFiltersCount = useMemo(
    () =>
      rootItems.reduce((acc, { name }) => {
        const rootFilterValue = get(value, name);

        if (isAnyFilterChecked(rootFilterValue)) {
          return acc + 1;
        }

        return acc;
      }, 0),
    [rootItems, value],
  );
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

  return (
    <>
      <div className="flex w-full justify-end">
        <ul className="hidden sm:block text-right mr-2">
          {rootItems.map(
            ({ items, name, label }) =>
              isAnyFilterChecked(get(value, name)) && (
                <li
                  className="inline-flex overflow-hidden pr-2"
                  key={name.toString()}
                  style={{
                    maxWidth: `${100 / activeRootFiltersCount}%`,
                  }}
                >
                  <RootPickedFilter<TValue>
                    items={items}
                    label={label}
                    value={get(value, name)}
                    onRemove={() => {
                      onChange(omit(value, name) as DeepPartial<TValue>);
                    }}
                  />
                </li>
              ),
          )}
        </ul>
        <FilterButton
          isOpen={isFiltersOpen}
          setTriggerRef={setTriggerRef}
          onClick={toggleModalOn}
          className="justify-self-end"
          numberSelectedFilters={countCheckedFilters(value)}
          customLabel={customLabel}
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
                  placeholder={searchPlaceholder}
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

Filters.displayName = displayName;

export default Filters;
