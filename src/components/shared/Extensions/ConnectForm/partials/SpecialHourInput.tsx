import React, { FC } from 'react';

import SpecialInput from '~common/Extensions/SpecialInput';
import FormError from '~v5/shared/FormError';
import ConnectForm from '../ConnectForm';
import { SpecialInputProps } from '../types';

const displayName = 'Extensions.ConnectForm.partials.SpecialHourInput';

const SpecialHourInput: FC<SpecialInputProps> = ({
  defaultValue,
  maxValue,
  errors,
  name = '',
}) => (
  <ConnectForm>
    {({ register }) => (
      <div className="text-right">
        <div className="flex justify-end flex-col w-full md:max-w-[8.75rem]">
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
    )}
  </ConnectForm>
);

SpecialHourInput.displayName = displayName;

export default SpecialHourInput;
