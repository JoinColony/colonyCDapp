import React, { FC, useState } from 'react';
import clsx from 'clsx';

import { usePopperTooltip } from 'react-popper-tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import { useMobile } from '~hooks';
import Checkbox from '~v5/common/Checkbox';

import { NestedOptionsProps } from '../types';
import Header from './Header';
import { useFilterContext } from '~context/FilterContext';
import { formatText } from '~utils/intl';
import PopoverBase from '~v5/shared/PopoverBase';
import { NestedFilterOption } from '~v5/common/Filter/types';
import { accordionAnimation } from '~constants/accordionAnimation';

const displayName = 'v5.SubNavigationItem.partials.NestedOptions';

const NestedOptions: FC<NestedOptionsProps> = ({
  parentOption,
  nestedFilters,
}) => {
  const isMobile = useMobile();
  const { handleFilterSelect, isFilterChecked } = useFilterContext();
  const [checkedParent, setCheckedParent] = useState<string | null>(null);

  const { getTooltipProps, setTooltipRef, setTriggerRef } = usePopperTooltip({
    delayShow: 200,
    delayHide: 200,
    placement: 'left-start',
    trigger: 'click',
    interactive: true,
  });

  const filterTitle = `${parentOption}.type`;

  const onChange = (
    hasNestedOptions: boolean,
    id: NestedFilterOption,
    isChecked: boolean,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (hasNestedOptions) {
      setCheckedParent(isChecked ? null : id);
    }

    handleFilterSelect(event);
  };

  return (
    <>
      {!isMobile && <Header title={{ id: filterTitle }} />}
      <ul
        className={clsx('flex flex-col', {
          'mt-1': isMobile,
        })}
      >
        {(nestedFilters || []).map(({ id, title, icon, nestedOptions }) => {
          const hasNestedOptions = !!nestedOptions && nestedOptions?.length > 0;
          const isChecked = hasNestedOptions
            ? checkedParent === id
            : isFilterChecked(id);

          return (
            <li key={id}>
              <button
                className={clsx('subnav-button', {
                  'px-0': isMobile,
                })}
                type="button"
                aria-label={formatText({ id: 'checkbox.select.filter' })}
                ref={setTriggerRef}
              >
                <Checkbox
                  id={id}
                  name={formatText(title) ?? ''}
                  label={title}
                  onChange={(event) =>
                    onChange(hasNestedOptions, id, isChecked, event)
                  }
                  isChecked={isChecked}
                  mode="secondary"
                >
                  {icon}
                </Checkbox>
              </button>
              <AnimatePresence>
                {nestedOptions &&
                  nestedOptions.length > 0 &&
                  isChecked &&
                  (isMobile ? (
                    <motion.div
                      key="accordion-content"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={accordionAnimation}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="ml-5">
                        <NestedOptions
                          parentOption={`custom.${parentOption}`}
                          nestedFilters={nestedFilters}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <PopoverBase
                      setTooltipRef={setTooltipRef}
                      tooltipProps={getTooltipProps}
                      withTooltipStyles={false}
                      cardProps={{
                        rounded: 's',
                        hasShadow: true,
                        className: 'py-4 px-2',
                      }}
                      classNames="w-full sm:max-w-[17.375rem] mr-2"
                    >
                      <NestedOptions
                        parentOption={`custom.${parentOption}`}
                        nestedFilters={nestedOptions}
                      />
                    </PopoverBase>
                  ))}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </>
  );
};

NestedOptions.displayName = displayName;

export default NestedOptions;
