import React, { FC, SyntheticEvent } from 'react';
import { useFormContext } from 'react-hook-form';

import SpecialInput from '~common/Extensions/SpecialInput';
import { GovernanceOptions } from '~frame/Extensions/pages/ExtensionsPage/types';
import { Message } from '~types';
import { formatText } from '~utils/intl';
import { get } from '~utils/lodash';
import FormError from '~v5/shared/FormError';

import { SpecialInputProps } from '../types';

const displayName = 'Extensions.ConnectForm.partials.SpecialHourInput';

const SpecialHourInput: FC<SpecialInputProps> = ({
  step,
  name = '',
  onInputChange,
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
      <div className="flex items-end justify-end flex-col w-full md:max-w-[8.75rem]">
        <SpecialInput
          isError={!!error}
          name={name}
          step={step}
          type="hours"
          placeholder="1"
          onChange={handleInputChange}
        />
        {error && <FormError>{formatText(error)}</FormError>}
      </div>
    </div>
  );
};

SpecialHourInput.displayName = displayName;

export default SpecialHourInput;
