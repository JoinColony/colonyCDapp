import React, { FC } from 'react';
import SpecialInput from '~common/Extensions/SpecialInput/SpecialInput';
import FormError from '~shared/Extensions/FormError/FormError';
import { SpecialInputProps } from '../types';

const displayName = 'Extensions.SpecialHourInput';

const SpecialHourInput: FC<SpecialInputProps> = ({ defaultValue, maxValue, register, errors, name }) => (
  <div className="text-right">
    <div className="flex justify-end flex-col w-[8.75rem]">
      <SpecialInput
        defaultValue={defaultValue as number}
        register={register}
        isError={!!errors?.[name]?.message}
        name={name}
        type="hours"
        min={1}
        max={maxValue}
        placeholder="1"
      />
      {errors?.[name] && <FormError>{errors?.[name]?.message}</FormError>}
    </div>
  </div>
);

SpecialHourInput.displayName = displayName;

export default SpecialHourInput;
