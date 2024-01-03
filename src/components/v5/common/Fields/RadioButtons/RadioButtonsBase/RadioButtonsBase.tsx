import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import React from 'react';

import RadioBase from './RadioBase';
import { RadioButtonsBaseProps } from './types';

const displayName = 'v5.common.RadioButtonsBase';

function RadioButtonsBase<TValue = string>({
  items,
  value,
  onChange = noop,
  name,
  disabled,
  keyExtractor = (item): string => String(item),
  valueComparator = isEqual,
  allowUnselect = false,
  className,
}: RadioButtonsBaseProps<TValue>): JSX.Element {
  return (
    <ul className={className}>
      {items.map(({ value: itemValue, disabled: itemDisabled, ...rest }) => {
        const checked = valueComparator(itemValue, value);

        return (
          <li key={keyExtractor(itemValue)}>
            <RadioBase
              {...rest}
              name={name}
              checked={checked}
              onChange={(event): void => {
                const { target } = event;

                if (!(target instanceof HTMLInputElement)) {
                  return;
                }

                onChange(target.checked ? itemValue : undefined);
              }}
              disabled={disabled || itemDisabled || (!allowUnselect && checked)}
            />
          </li>
        );
      })}
    </ul>
  );
}

RadioButtonsBase.displayName = displayName;

export default RadioButtonsBase;
