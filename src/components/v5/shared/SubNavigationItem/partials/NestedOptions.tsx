import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useFilterContext } from '~context/FilterContext/FilterContext.ts';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';
import { type NestedFilterOption } from '~v5/common/Filter/types.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import { type NestedOptionsProps } from '../types.ts';

import Header from './Header.tsx';

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
    offset: [0, 16],
  });

  const filterTitle = `${parentOption}.type`;

  const onChange = ({
    hasNestedOptions,
    id,
    isChecked,
    event,
  }: {
    hasNestedOptions: boolean;
    id: NestedFilterOption;
    isChecked: boolean;
    event: React.ChangeEvent<HTMLInputElement>;
  }) => {
    if (hasNestedOptions) {
      setCheckedParent(isChecked ? null : id);

      return;
    }

    handleFilterSelect(event);
  };

  return (
    <>
      {!isMobile && <Header title={{ id: filterTitle }} className="pb-2" />}
      <ul
        className={clsx('flex flex-col', {
          'mt-2': isMobile,
        })}
      >
        {(nestedFilters || []).map(
          ({ id, title, icon: Icon, nestedOptions }) => {
            const hasNestedOptions =
              !!nestedOptions && nestedOptions?.length > 0;
            const isChecked = hasNestedOptions
              ? checkedParent === id
              : isFilterChecked(id);
            const isNestedOptionsChecked = hasNestedOptions
              ? nestedOptions?.some((option) => isFilterChecked(option.id))
              : false;

            return (
              <li key={id}>
                <div
                  className={clsx('subnav-button', {
                    'px-0': isMobile,
                  })}
                  aria-label={formatText({ id: 'checkbox.select.filter' })}
                  ref={setTriggerRef}
                >
                  <Checkbox
                    id={id}
                    name={formatText(title)}
                    label={title}
                    onChange={(event) =>
                      onChange({ hasNestedOptions, id, isChecked, event })
                    }
                    isChecked={isChecked || isNestedOptionsChecked}
                    className="w-full"
                  >
                    {Icon ? <Icon size={14} /> : null}
                  </Checkbox>
                </div>
                <AnimatePresence>
                  {nestedOptions &&
                    nestedOptions.length > 0 &&
                    (isChecked || isNestedOptionsChecked) &&
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
                            nestedFilters={nestedOptions}
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
                        className="w-full sm:max-w-[17.375rem]"
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
          },
        )}
      </ul>
    </>
  );
};

NestedOptions.displayName = displayName;

export default NestedOptions;
