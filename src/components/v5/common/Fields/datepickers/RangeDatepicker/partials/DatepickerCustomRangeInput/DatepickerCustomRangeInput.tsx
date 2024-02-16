import format from 'date-fns/format';
import React from 'react';

import { formatText } from '~utils/intl.ts';
import InputBase from '~v5/common/Fields/InputBase/index.ts';

import { type DatepickerCustomRangeInputProps } from './types.ts';

const DatepickerCustomRangeInput = React.forwardRef<
  HTMLInputElement,
  DatepickerCustomRangeInputProps
>(({ onClick, onFocus, startDate, endDate, dateFormat }) => {
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
