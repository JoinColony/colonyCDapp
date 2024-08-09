import React from 'react';

import { formatText } from '~utils/intl.ts';
import InputBase from '~v5/common/Fields/InputBase/index.ts';
import { type InputBaseProps } from '~v5/common/Fields/InputBase/types.ts';

const DatepickerCustomInput = React.forwardRef<
  HTMLInputElement,
  InputBaseProps
>(({ value, onClick, ...rest }, ref) => {
  return (
    <InputBase
      ref={ref}
      value={value}
      onClick={onClick}
      placeholder={formatText({ id: 'calendar.selectDate' })}
      mode="secondary"
      {...rest}
    />
  );
});
export default DatepickerCustomInput;
