import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';

interface TokenChoiceOptionsProps {
  tokenChoiceOptions: Array<string>;
}

export const TokenChoiceOptions = ({
  tokenChoiceOptions,
}: TokenChoiceOptionsProps) => {
  const { register } = useFormContext();

  const { formatMessage } = useIntl();

  return (
    <div className="flex gap-4">
      {tokenChoiceOptions.map((option) => (
        <label
          key={`tokenChoice-${option}`}
          htmlFor={option}
          className="pb-6 flex gap-2 text-md text-gray-900"
        >
          <input
            {...register('tokenChoiceVerify')}
            type="radio"
            value={option}
            id={option}
          />
          {formatMessage({
            id: `createColonyWizard.step.nativeToken.${option}`,
          })}
        </label>
      ))}
    </div>
  );
};
