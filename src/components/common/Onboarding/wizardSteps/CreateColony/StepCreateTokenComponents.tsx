import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { MSGTokenChoice as MSG } from '../shared.ts';

import { type TokenChoice } from './types.ts';

interface TokenChoiceOptionsProps {
  tokenChoiceOptions: Array<TokenChoice>;
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
          className="flex items-center gap-2 pb-6 text-md text-gray-900"
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
            className="flex h-4 min-h-4 w-4 min-w-4 appearance-none items-center justify-center rounded-full border border-gray-200 transition ease-in checked:border-blue-400 checked:after:block checked:after:h-[7px] checked:after:w-[7px] checked:after:rounded-full checked:after:bg-blue-400 checked:after:content-['']"
          />
          {formatMessage(MSG[`${option}OptionTitle`])}
        </label>
      ))}
    </div>
  );
};
