import React from 'react';

import { formatText } from '~utils/intl';
import InputBase from '~v5/common/Fields/InputBase';
import { InputBaseProps } from '~v5/common/Fields/InputBase/types';

const DatepickerCustomInput = React.forwardRef<
  HTMLInputElement,
  InputBaseProps
>(({ value, onClick }, ref) => {
  return (
    <InputBase
      ref={ref}
      value={value}
      onClick={onClick}
      placeholder={formatText({ id: 'calendar.selectDate' })}
    />
  );
});
export default DatepickerCustomInput;
