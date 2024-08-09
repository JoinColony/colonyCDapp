import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

import InputBase from '~v5/common/Fields/InputBase/index.ts';
import { type InputBaseProps } from '~v5/common/Fields/InputBase/types.ts';

const DatepickerCustomTimeInput = React.forwardRef<
  HTMLInputElement,
  InputBaseProps
>(({ value, onClick, className, ...rest }, ref) => {
  return (
    <InputBase
      ref={ref}
      value={value}
      onClick={onClick}
      placeholder="--:--"
      inputWrapperClassName="relative"
      className={clsx(className, 'relative z-base !bg-transparent !pr-10')}
      suffix={
        <CaretDown
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 fill-gray-400"
        />
      }
      {...rest}
    />
  );
});

export default DatepickerCustomTimeInput;
