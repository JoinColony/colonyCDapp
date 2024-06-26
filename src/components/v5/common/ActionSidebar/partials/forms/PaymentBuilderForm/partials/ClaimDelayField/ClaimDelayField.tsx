import React, { type FC } from 'react';
import { useController } from 'react-hook-form';

import { FieldState } from '~v5/common/Fields/consts.ts';
import InputBase from '~v5/common/Fields/InputBase/InputBase.tsx';

import { CLAIM_DELAY_MIN_VALUE } from './consts.ts';
import { type ClaimDelayFieldProps } from './types.ts';

const ClaimDelayField: FC<ClaimDelayFieldProps> = ({
  name,
  disabled,
  placeholder,
  suffix,
  className,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
  });
  const isError = !!error;

  return (
    <InputBase
      {...field}
      disabled={disabled}
      name={name}
      className={className}
      mode="secondary"
      inputWrapperClassName="flex w-full items-center gap-3 text-md"
      autoWidth
      state={isError ? FieldState.Error : undefined}
      placeholder={placeholder || '0'}
      autoComplete="off"
      type="number"
      inputMode="decimal"
      step={CLAIM_DELAY_MIN_VALUE}
      suffix={suffix}
    />
  );
};

export default ClaimDelayField;
