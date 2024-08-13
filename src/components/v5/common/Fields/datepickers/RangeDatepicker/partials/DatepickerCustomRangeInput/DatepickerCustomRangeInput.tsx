import format from 'date-fns/format';
import React from 'react';

import { formatText } from '~utils/intl.ts';
import InputBase from '~v5/common/Fields/InputBase/index.ts';

import { type DatepickerCustomRangeInputProps } from './types.ts';

const DatepickerCustomRangeInput = React.forwardRef<
  HTMLInputElement,
  DatepickerCustomRangeInputProps
  // ref has to be there to avoid a warning in a console:
  // Warning: forwardRef render functions accept exactly two parameters: props and ref. Did you forget to use the ref parameter?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ onClick, onFocus, startDate, endDate, dateFormat, disabled }, ref) => {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <InputBase
        placeholder={formatText({ id: 'calendar.from' })}
        readOnly
        onClick={onClick}
        onFocus={onFocus}
        value={startDate ? format(startDate, dateFormat) : ''}
        disabled={disabled}
      />
      <span className="flex w-6 flex-shrink-0 items-center justify-center text-center text-gray-900 text-2">
        -
      </span>
      <InputBase
        placeholder={formatText({ id: 'calendar.to' })}
        readOnly
        onClick={onClick}
        onFocus={onFocus}
        value={endDate ? format(endDate, dateFormat) : ''}
        disabled={disabled}
      />
    </div>
  );
});

export default DatepickerCustomRangeInput;
