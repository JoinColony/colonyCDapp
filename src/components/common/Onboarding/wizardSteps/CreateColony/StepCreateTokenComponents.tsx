import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { MSG } from './StepTokenChoice';

interface TokenChoiceOptionsProps {
  tokenChoiceOptions: Array<string>;
}

export const TokenChoiceOptions = ({
  tokenChoiceOptions,
}: TokenChoiceOptionsProps) => {
  const { register, clearErrors } = useFormContext();

  const { formatMessage } = useIntl();

  const { onChange } = register('tokenChoice');

  return (
    <div className="flex gap-4">
      {tokenChoiceOptions.map((option) => (
        <label
          key={`tokenChoice-${option}`}
          htmlFor={option}
          className="pb-6 flex gap-2 text-md text-gray-900"
        >
          <input
            {...register('tokenChoice')}
            onChange={(event) => {
              clearErrors();
              onChange(event);
            }}
            type="radio"
            value={option}
            id={option}
          />
          {formatMessage(MSG[`${option}OptionTitle`])}
        </label>
      ))}
    </div>
  );
};
