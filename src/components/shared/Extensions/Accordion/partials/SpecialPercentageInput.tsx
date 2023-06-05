import React, { FC } from 'react';
import SpecialInput from '~common/Extensions/SpecialInput/SpecialInput';
import FormError from '~shared/Extensions/FormError/FormError';
import { SpecialInputProps } from '../types';

const displayName = 'Extensions.SpecialPercentageInput';

const SpecialPercentageInput: FC<SpecialInputProps> = ({
  defaultValue,
  maxValue,
  minValue,
  register,
  errors,
  name,
}) => (
  <div className="text-right">
    <div className="flex justify-end flex-col w-[8.8rem]">
      <SpecialInput
        defaultValue={defaultValue as number}
        register={register}
        isError={!!errors?.[name]?.message}
        name={name}
        min={minValue}
        max={maxValue}
        type="percent"
        placeholder="1"
      />
      {errors?.[name] && <FormError>{errors?.[name]?.message}</FormError>}
    </div>
  </div>
);

SpecialPercentageInput.displayName = displayName;

export default SpecialPercentageInput;
