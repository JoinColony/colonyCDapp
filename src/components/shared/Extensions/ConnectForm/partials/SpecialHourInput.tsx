import React, { type FC, type SyntheticEvent } from 'react';
import { useFormContext } from 'react-hook-form';

import SpecialInput from '~common/Extensions/SpecialInput/index.ts';
import { GovernanceOptions } from '~frame/Extensions/pages/ExtensionsPage/types.ts';
import { type Message } from '~types/index.ts';
import { formatText } from '~utils/intl.ts';
import { get } from '~utils/lodash.ts';
import FormError from '~v5/shared/FormError/index.ts';

import { type SpecialInputProps } from '../types.ts';

const displayName = 'Extensions.ConnectForm.partials.SpecialHourInput';

const SpecialHourInput: FC<SpecialInputProps> = ({
  step,
  name = '',
  onInputChange,
  disabled,
}) => {
  const {
    formState: { errors },
    setValue,
  } = useFormContext();

  const error = get(errors, name)?.message as Message | undefined;

  const handleInputChange = (e: SyntheticEvent<HTMLInputElement>) => {
    onInputChange?.(e);
    setValue('option', GovernanceOptions.CUSTOM, { shouldValidate: true });
  };

  return (
    <div className="text-right">
      <div className="flex w-full flex-col items-end justify-end md:max-w-[8.75rem]">
        <SpecialInput
          isError={!!error}
          name={name}
          step={step}
          type="hours"
          placeholder="1"
          onChange={handleInputChange}
          disabled={disabled}
        />
        {error && <FormError>{formatText(error)}</FormError>}
      </div>
    </div>
  );
};

SpecialHourInput.displayName = displayName;

export default SpecialHourInput;
