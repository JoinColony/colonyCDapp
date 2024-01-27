import clsx from 'clsx';
import React, { useId } from 'react';
import ReactSelect from 'react-select';

import { SelectBaseOption, SelectBaseProps } from './types.ts';

const displayName = 'v5.common.Fields.SelectBase';

const SelectBase = <T extends SelectBaseOption>({
  className,
  value,
  defaultValue,
  styles,
  ...rest
}: SelectBaseProps<T>): ReturnType<React.FC> => {
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
    />
  );
};

Object.assign(SelectBase, { displayName });

export default SelectBase;
