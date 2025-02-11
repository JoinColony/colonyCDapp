import clsx from 'clsx';
import { addYears, subYears } from 'date-fns';
import format from 'date-fns/format';
import isDate from 'date-fns/isDate';
import React, { useState, type FC } from 'react';
import { useController } from 'react-hook-form';

import { useMobile } from '~hooks';
import CardSelect from '~v5/common/Fields/CardSelect/CardSelect.tsx';
import { FieldState } from '~v5/common/Fields/consts.ts';
import { DEFAULT_DATE_TIME_FORMAT } from '~v5/common/Fields/datepickers/common/consts.ts';
import DatepickerWithTime from '~v5/common/Fields/datepickers/DatepickerWithTime/DatepickerWithTime.tsx';

import { type TimeRowFieldProps } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.TimeRow.partials.TimeRowField';

const TimeRowField: FC<TimeRowFieldProps> = ({
  name,
  options,
  placeholder: placeholderProp,
  selectedValueWrapperClassName,
  minDate,
  customDateValue,
}) => {
  const isMobile = useMobile();
  const [isDatepickerVisible, setIsDatepickerVisible] = useState(false);
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
  });

  const [value, setValue] = useState(
    isDate(field.value) ? customDateValue : field.value,
  );

  const year15YearsAgo = subYears(new Date(), 15).getFullYear();
  const year15YearsAhead = addYears(new Date(), 15).getFullYear();

  return (
    <CardSelect<string>
      options={options}
      state={error ? FieldState.Error : undefined}
      value={value}
      placeholder={placeholderProp}
      cardClassName={clsx('sm:!w-[20.5rem]', {
        '!left-6 right-6': isMobile,
        'pb-0': isDatepickerVisible,
      })}
      renderSelectedValue={(selectedValue, placeholder) => {
        if (selectedValue?.value === customDateValue) {
          return (
            <div className={selectedValueWrapperClassName}>
              {field.value
                ? format(field.value, DEFAULT_DATE_TIME_FORMAT)
                : 'Custom date and time'}
            </div>
          );
        }
        return (
          <div className={selectedValueWrapperClassName}>
            {selectedValue?.label || placeholder}
          </div>
        );
      }}
      renderOptionWrapper={(
        { value: itemValue, onClick, className, ...props },
        children,
      ) => {
        const isCustomDate = itemValue === customDateValue;

        return isCustomDate ? (
          <div className="flex w-full flex-col">
            <button
              type="button"
              onClick={() => {
                setIsDatepickerVisible(true);
                if (!isDate(field.value)) {
                  field.onChange(itemValue);
                }
              }}
              className={clsx(className, {
                'bg-gray-50 font-medium transition-colors':
                  value === itemValue || isDatepickerVisible,
              })}
              {...props}
            >
              {children}
            </button>
            {isDatepickerVisible && (
              <div className="-mx-2 mt-4 w-[calc(100%+1rem)] border-t border-t-gray-200 pt-5">
                <DatepickerWithTime
                  selected={isDate(field.value) ? field.value : null}
                  onChange={(date) => {
                    setValue(itemValue || '');
                    field.onChange(date ?? '');
                  }}
                  inline
                  onClose={onClick}
                  minDate={minDate}
                  minYear={year15YearsAgo}
                  maxYear={year15YearsAhead}
                />
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              onClick?.();
              setValue(itemValue || '');
              field.onChange(itemValue || '');
              setIsDatepickerVisible(false);
            }}
            className={clsx(className, {
              'bg-gray-50 font-medium transition-colors':
                value === itemValue && !isDatepickerVisible,
            })}
            {...props}
          >
            {children}
          </button>
        );
      }}
    />
  );
};

TimeRowField.displayName = displayName;

export default TimeRowField;
