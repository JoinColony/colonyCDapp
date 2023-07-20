import React, { FC } from 'react';

import SpecialInput from '~common/Extensions/SpecialInput';
import FormError from '~v5/shared/FormError';
import { SpecialInputProps } from '../types';
import ConnectForm from './ConnectForm';

const displayName = 'Extensions.SpecialPercentageInput';

const SpecialPercentageInput: FC<SpecialInputProps> = ({
  defaultValue,
  maxValue,
  minValue,
  errors,
  name = '',
}) => (
  <ConnectForm>
    {({ register }) => (
      <div className="text-right">
        <div className="flex items-end justify-end flex-col w-full md:max-w-[8.75rem]">
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
    )}
  </ConnectForm>
);

SpecialPercentageInput.displayName = displayName;

export default SpecialPercentageInput;
