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
>(({ onClick, onFocus, startDate, endDate, dateFormat }, ref) => {
  return (
    <div className="w-full flex items-center justify-between gap-2">
      <InputBase
        placeholder={formatText({ id: 'calendar.from' })}
        readOnly
        onClick={onClick}
        onFocus={onFocus}
        value={startDate ? format(startDate, dateFormat) : ''}
      />
      <span className="flex justify-center items-center flex-shrink-0 text-gray-900 text-2 w-6 text-center">
        -
      </span>
      <InputBase
        placeholder={formatText({ id: 'calendar.to' })}
        readOnly
        onClick={onClick}
        onFocus={onFocus}
        value={endDate ? format(endDate, dateFormat) : ''}
      />
    </div>
  );
});

export default DatepickerCustomRangeInput;
