import { CaretDown } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { type DropdownIndicatorProps, components } from 'react-select';

const displayName = 'v5.common.Fields.Select.partials.DropdownIndicator';

function DropdownIndicator<TValue>(
  props: DropdownIndicatorProps<TValue, false>,
): JSX.Element {
  return (
    <components.DropdownIndicator {...props}>
      <CaretDown size={18} />
    </components.DropdownIndicator>
  );
}

(DropdownIndicator as FC).displayName = displayName;

export default DropdownIndicator;
