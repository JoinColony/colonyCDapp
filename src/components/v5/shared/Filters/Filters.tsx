import { X } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { Fragment, useCallback, useMemo } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { DeepPartial } from 'utility-types';

import { accordionAnimation } from '~constants/accordionAnimation';
import { useMobile } from '~hooks';
import useToggle from '~hooks/useToggle';
import Icon from '~shared/Icon';
import {
  cloneDeep,
  get,
  omit,
  set,
  toPath,
  toString,
  unset,
} from '~utils/lodash';
import Checkbox from '~v5/common/Checkbox';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem';
import FilterButton from '~v5/shared/FilterButton/FilterButton';
import Modal from '~v5/shared/Modal';
import PopoverBase from '~v5/shared/PopoverBase';
import SearchInput from '~v5/shared/SearchSelect/partials/SearchInput';
import Header from '~v5/shared/SubNavigationItem/partials/Header';

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

function NestedFilterItem<
  TValue extends FiltersValue,
  TFullValue extends FiltersValue,
  TName extends keyof TValue,
>({
  label,
  path,
  value,
  onChange,
  items: nestedItems,
  render,
  popoverClassName,
}: NestedFilterProps<TValue, TFullValue, TName>) {
  type ChildFilterProps = NestedFilterProps<
    TValue[keyof TValue],
    TFullValue,
    keyof TValue
  >;

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
  const filterValue = get(value, path);
  const isChecked = !!filterValue;
  const isMobile = useMobile();
  const NestedItems = nestedItems?.map((nestedItem) => (
    <NestedFilterItem
      key={toString(nestedItem.name)}
      onChange={onChange}
      path={`${path}.${nestedItem.name}`}
      value={value}
      label={nestedItem.label}
      items={nestedItem.items as ChildFilterProps['items']}
      name={toString(nestedItem.name)}
      render={nestedItem.render as ChildFilterProps['render']}
      popoverClassName={nestedItem.popoverClassName}
    />
  ));
  const filterContent = render ? (
    render({
      value: filterValue,
      onChange: (newValue) => {
        const clonedValue = cloneDeep(value);

        if (newValue === undefined) {
          unset(clonedValue, path);
        } else {
          set(clonedValue, path, newValue);
        }

        onChange(clonedValue);
      },
    })
  ) : (
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
          {filterContent}
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
          <div ref={setNestedTriggerRef}>{filterContent}</div>
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
              classNames={clsx(
                'w-full sm:max-w-[13.25rem] mr-2',
                popoverClassName,
              )}
            >
              {NestedItems}
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
}

function RootFilter<
  TValue extends FiltersValue,
  TFullValue extends FiltersValue,
  TName extends keyof TValue,
>({
  items,
  label,
  icon,
  onChange,
  path,
  value,
  title,
  popoverClassName,
}: RootFilterProps<TValue, TFullValue, TName>) {
  type ChildFilterProps = NestedFilterProps<
    TValue[keyof TValue],
    TFullValue,
    keyof TValue
  >;
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
    ({
      label: nestedFilterItemLabel,
      name,
      items: nestedFilterItems,
      render,
      popoverClassName: nestedPopoverClassName,
    }) => (
      <NestedFilterItem<TValue[keyof TValue], TFullValue, keyof TValue>
        key={toString(name)}
        label={nestedFilterItemLabel}
        name={toString(name)}
        items={nestedFilterItems as ChildFilterProps['items']}
        onChange={onChange}
        value={value}
        path={`${path}.${toString(name)}`}
        render={render as ChildFilterProps['render']}
        popoverClassName={nestedPopoverClassName}
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
              classNames={clsx(
                'w-full sm:max-w-[13.25rem] mr-2',
                popoverClassName,
              )}
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

function NestedPickedFilter<
  TValue extends FiltersValue,
  TFullValue extends FiltersValue,
>({ value, items, label }: NestedPickedFilterProps<TValue, TFullValue>) {
  type ChildNestedPickedFilterProps = NestedPickedFilterProps<
    TValue[keyof TValue],
    TFullValue
  >;
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
      {items.map((nested) => {
        const nestedValue = get(value, toString(nested.name));

        return (
          <Fragment key={toString(nested.name)}>
            {nested.renderPickedLabel ? (
              nested.renderPickedLabel({
                value: nestedValue,
                label: nested.label,
              })
            ) : (
              <NestedPickedFilter<TValue[keyof TValue], TFullValue>
                value={nestedValue}
                label={nested.label}
                items={nested.items as ChildNestedPickedFilterProps['items']}
              />
            )}
          </Fragment>
        );
      })}
    </>
  );
}

function RootPickedFilter<
  TValue extends FiltersValue,
  TFullValue extends FiltersValue,
>({
  items,
  value,
  label,
  onRemove,
}: RootPickedFilterProps<TValue, TFullValue>) {
  return (
    <div className="bg-blue-100 rounded-lg text-blue-400 px-3 py-2 flex gap-2 items-center text-sm max-w-full text-left">
      <div className="[&_span:not(:last-child)]:after:content-[',_'] font-medium line-clamp-1">
        <NestedPickedFilter<TValue[keyof TValue], TFullValue>
          items={items}
          value={value}
          label={label}
        />
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
  popoverClassName,
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
        const rootFilterValue = get(value, toString(name));

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

  const RootItems = rootItems.map(({ items, name, title, ...rest }) => (
    <RootFilter<TValue[keyof TValue], TValue, keyof TValue>
      key={toString(name)}
      title={title}
      name={toString(name)}
      items={
        items as RootFilterProps<
          TValue[keyof TValue],
          TValue,
          keyof TValue
        >['items']
      }
      path={toString(name)}
      value={value}
      onChange={onChange}
      {...rest}
    />
  ));

  return (
    <>
      <div className="flex w-full justify-end">
        <ul className="hidden sm:block text-right mr-2">
          {rootItems.map(
            ({ items, name, label }) =>
              isAnyFilterChecked(get(value, toString(name))) && (
                <li
                  className="inline-flex overflow-hidden pr-2"
                  key={toString(name)}
                  style={{
                    maxWidth: `${100 / activeRootFiltersCount}%`,
                  }}
                >
                  <RootPickedFilter<TValue[keyof TValue], TValue>
                    items={
                      items as RootPickedFilterProps<
                        TValue[keyof TValue],
                        TValue
                      >['items']
                    }
                    label={label}
                    value={get(value, toString(name))}
                    onRemove={() => {
                      onChange(
                        omit(value, toString(name)) as DeepPartial<TValue>,
                      );
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
              classNames={clsx('w-full sm:max-w-[20.375rem]', popoverClassName)}
            >
              <div className="px-3.5 mb-6">
                <SearchInput
                  onChange={onInputChange}
                  value={searchValue}
                  shouldFocus
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
