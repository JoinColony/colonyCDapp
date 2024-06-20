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
            className="relative h-4 max-h-4 min-h-4 w-4 min-w-4 max-w-4 appearance-none rounded-full border border-gray-200 transition ease-in checked:border-blue-400 checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:block checked:after:h-[7.02px] checked:after:w-[7.02px] checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:rounded-full checked:after:bg-blue-400 checked:after:content-['']"
          />
          {formatMessage(MSG[`${option}OptionTitle`])}
        </label>
      ))}
    </div>
  );
};
