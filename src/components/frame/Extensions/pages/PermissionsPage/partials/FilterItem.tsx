import { CaretDown } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useMobile } from '~hooks';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/Checkbox.tsx';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/PopoverBase.tsx';

import { type PermissionsPageFilterRootProps } from './types.ts';

const RootFilter: FC<PermissionsPageFilterRootProps> = ({
  icon: Icon,
  label,
  title,
  items,
  onChange,
  filterValue,
}) => {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      delayShow: 200,
      delayHide: 200,
      placement: 'left-start',
      interactive: true,
      offset: [0, 20],
    });
  const {
    getTooltipProps: getNestedTooltipProps,
    setTooltipRef: setNestedTooltipRef,
    setTriggerRef: setNestedTriggerRef,
  } = usePopperTooltip({
    delayShow: 200,
    delayHide: 200,
    placement: 'left-start',
    interactive: true,
    offset: [0, 20],
  });
  const isMobile = useMobile();
  const [isAccordionOpen, { toggle: toggleAccordion }] = useToggle({
    defaultToggleState: true,
  });

  return (
    <>
      {isMobile ? (
        <AccordionItem
          isOpen={isAccordionOpen}
          onToggle={toggleAccordion}
          title={title}
          icon={CaretDown}
          iconSize={16}
          className="mb-4 last:mb-0 [&_.accordion-icon]:text-gray-700 [&_.accordion-toggler>span]:text-gray-700 [&_.accordion-toggler]:mb-2 [&_.accordion-toggler]:uppercase [&_.accordion-toggler]:text-gray-400 [&_.accordion-toggler]:text-4 sm:[&_.accordion-toggler]:mb-0 sm:[&_.accordion-toggler]:px-3.5"
        >
          {items.map(({ value, label: checkboxLabel, items: nestedItems }) => (
            <div key={value}>
              <Checkbox
                isChecked={filterValue[value]}
                onChange={() => {
                  const updatedFilterValue = {
                    ...filterValue,
                    [value]: !filterValue[value],
                  };

                  if (filterValue[value] && nestedItems) {
                    const nestedItemsValues = nestedItems.reduce(
                      (acc, { value: nestedValue }) => ({
                        ...acc,
                        [nestedValue]: false,
                      }),
                      {},
                    );

                    onChange({
                      ...updatedFilterValue,
                      ...nestedItemsValues,
                    });

                    return;
                  }

                  onChange(updatedFilterValue);
                }}
                className="subnav-button px-0 sm:px-3.5"
              >
                {checkboxLabel}
              </Checkbox>
              {nestedItems && filterValue[value] && (
                <AnimatePresence>
                  <motion.div
                    key="accordion-content"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={accordionAnimation}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="overflow-hidden pl-4"
                  >
                    {nestedItems.map(
                      ({ value: nestedValue, label: nestedCheckboxLabel }) => (
                        <Checkbox
                          key={nestedValue}
                          isChecked={filterValue[nestedValue]}
                          onChange={() => {
                            onChange({
                              ...filterValue,
                              [nestedValue]: !filterValue[nestedValue],
                            });
                          }}
                          className="subnav-button px-0 sm:px-3.5"
                        >
                          {nestedCheckboxLabel}
                        </Checkbox>
                      ),
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          ))}
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
              className="w-full sm:max-w-[13.25rem]"
            >
              <span className="px-3.5 pb-2 uppercase text-gray-400 text-4">
                {formatText({ id: 'permissions.type' })}
              </span>
              {items.map(
                ({ value, label: checkboxLabel, items: nestedItems }) => (
                  <div ref={setNestedTriggerRef} key={value}>
                    <Checkbox
                      isChecked={filterValue[value]}
                      onChange={() => {
                        const updatedFilterValue = {
                          ...filterValue,
                          [value]: !filterValue[value],
                        };

                        if (filterValue[value] && nestedItems) {
                          const nestedItemsValues = nestedItems.reduce(
                            (acc, { value: nestedValue }) => ({
                              ...acc,
                              [nestedValue]: false,
                            }),
                            {},
                          );

                          onChange({
                            ...updatedFilterValue,
                            ...nestedItemsValues,
                          });

                          return;
                        }

                        onChange(updatedFilterValue);
                      }}
                      className="subnav-button px-0 sm:px-3.5"
                    >
                      {checkboxLabel}
                    </Checkbox>
                    {nestedItems && filterValue[value] && (
                      <PopoverBase
                        setTooltipRef={setNestedTooltipRef}
                        tooltipProps={getNestedTooltipProps}
                        withTooltipStyles={false}
                        cardProps={{
                          rounded: 's',
                          hasShadow: true,
                          className: 'py-6 px-2',
                        }}
                        className="w-full sm:max-w-[13.25rem]"
                      >
                        <span className="px-3.5 uppercase text-gray-400 text-4">
                          {formatText({ id: 'permissions.type' })}
                        </span>
                        {nestedItems.map(
                          ({
                            value: nestedValue,
                            label: nestedCheckboxLabel,
                          }) => (
                            <Checkbox
                              key={nestedValue}
                              isChecked={filterValue[nestedValue]}
                              onChange={() => {
                                onChange({
                                  ...filterValue,
                                  [nestedValue]: !filterValue[nestedValue],
                                });
                              }}
                              className="subnav-button px-0 sm:px-3.5"
                            >
                              {nestedCheckboxLabel}
                            </Checkbox>
                          ),
                        )}
                      </PopoverBase>
                    )}
                  </div>
                ),
              )}
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
};

export default RootFilter;
