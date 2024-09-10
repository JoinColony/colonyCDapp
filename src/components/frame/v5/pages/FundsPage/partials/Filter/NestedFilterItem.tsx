import { AnimatePresence, motion } from 'framer-motion';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useMobile } from '~hooks';
import Checkbox from '~v5/common/Checkbox/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import { type FilterValue, type NestedFilterProps } from './types.ts';

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
            className="subnav-button px-0 sm:px-3.5"
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
              className="subnav-button px-0 sm:px-3.5"
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
              className="mr-2 w-full sm:max-w-[13.25rem]"
            >
              {NestedItems}
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
}

export default NestedFilterItem;
