import clsx from 'clsx';
import React, { useState, type FC } from 'react';
import { useController } from 'react-hook-form';

import SpecialInputBase from '~common/Extensions/SpecialInput/SpecialInputBase.tsx';
import { useMobile } from '~hooks';
import CardSelect from '~v5/common/Fields/CardSelect/CardSelect.tsx';
import { FieldState } from '~v5/common/Fields/consts.ts';

import { ONE_DAY_IN_SECONDS } from '../../consts.ts';
import { AmountPerInterval } from '../../types.ts';

import { type AmountPerPeriodRowFieldProps } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.AmountPerPeriodRow.partials.AmountPerPeriodRowField';

const AmountPerPeriodRowField: FC<AmountPerPeriodRowFieldProps> = ({
  name,
  options,
  placeholder: placeholderProp,
  selectedValueWrapperClassName,
}) => {
  const isMobile = useMobile();
  const {
    field,
    fieldState: { error },
  } = useController({
    name: `${name}.interval`,
  });
  const {
    field: fieldCustom,
    fieldState: { error: errorCustom },
  } = useController({
    name: `${name}.custom`,
  });

  const [customInputValue, setCustomInputValue] = useState(
    fieldCustom.value
      ? (fieldCustom.value / ONE_DAY_IN_SECONDS).toString()
      : '30',
  );

  return (
    <CardSelect<string>
      options={options}
      state={error || errorCustom ? FieldState.Error : undefined}
      value={field.value}
      placeholder={placeholderProp}
      cardClassName={clsx('sm:!w-[16rem]', {
        '!left-6 right-6': isMobile,
        'pb-0': field.value === AmountPerInterval.Custom,
      })}
      renderSelectedValue={(selectedValue, placeholder) => {
        if (selectedValue?.value === AmountPerInterval.Custom) {
          return (
            <div className={selectedValueWrapperClassName}>
              {`${customInputValue} Days`}
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
        const isCustomValue = itemValue === AmountPerInterval.Custom;

        return isCustomValue ? (
          <div className="flex w-full flex-col">
            <button
              type="button"
              onClick={() => {
                field.onChange(itemValue);
              }}
              className={clsx(className, {
                'bg-gray-50 font-medium transition-colors':
                  field.value === itemValue,
              })}
              {...props}
            >
              {children}
            </button>
            {field.value === AmountPerInterval.Custom && (
              <div className="-mx-2 mt-4 w-[calc(100%+1rem)] border-t border-t-gray-200 p-4">
                <SpecialInputBase
                  type="days"
                  name="custom_period"
                  value={customInputValue}
                  onChange={(e) => {
                    setCustomInputValue(e.currentTarget.value.substring(0, 5));

                    const calculatedValue =
                      Number(e.currentTarget.value.substring(0, 5)) *
                      ONE_DAY_IN_SECONDS;

                    fieldCustom.onChange(calculatedValue);
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              onClick?.();
              field.onChange(itemValue);
              fieldCustom.onChange(30 * ONE_DAY_IN_SECONDS);
              setCustomInputValue('30');
            }}
            className={clsx(className, {
              'bg-gray-50 font-medium transition-colors':
                field.value === itemValue,
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

AmountPerPeriodRowField.displayName = displayName;

export default AmountPerPeriodRowField;
