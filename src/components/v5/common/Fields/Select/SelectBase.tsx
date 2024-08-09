import clsx from 'clsx';
import React, { forwardRef, useId } from 'react';
import ReactSelect, { type SelectInstance } from 'react-select';

import { type SelectBaseOption, type SelectBaseProps } from './types.ts';

const displayName = 'v5.common.Fields.SelectBase';

const SelectBaseInner = <T extends SelectBaseOption>(
  { className, value, defaultValue, styles, ...rest }: SelectBaseProps<T>,
  ref,
): ReturnType<React.FC> => {
  const id = useId();

  const selectedOption = rest.options?.find((option) =>
    'value' in option ? option.value === value : undefined,
  ) as T;

  const defaultSelectedOption = defaultValue
    ? (rest.options?.find((option) =>
        'value' in option ? option.value === defaultValue : undefined,
      ) as T)
    : undefined;

  return (
    <ReactSelect
      instanceId={id}
      className={clsx(className)}
      classNamePrefix="select"
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }), ...styles }}
      {...rest}
      value={selectedOption || null}
      defaultValue={defaultSelectedOption}
      ref={ref}
      menuShouldScrollIntoView={false}
    />
  );
};
SelectBaseInner.displayName = displayName;

const SelectBase = forwardRef(SelectBaseInner) as <T extends SelectBaseOption>(
  props: SelectBaseProps<T> & { ref?: React.ForwardedRef<SelectInstance> },
) => ReturnType<typeof SelectBaseInner>;

export default SelectBase;
