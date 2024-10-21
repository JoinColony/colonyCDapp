import React from 'react';
import { useController } from 'react-hook-form';

import RadioButton from './RadioButton.tsx';
import { PenaliseOptions } from './types.ts';

const RadioButtons = () => {
  const {
    field: { onChange },
    fieldState: { error },
  } = useController({
    name: 'penalise',
  });

  return (
    <div>
      <ul className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
        <li className="w-full sm:w-1/2">
          <RadioButton
            id={PenaliseOptions.Yes}
            value={PenaliseOptions.Yes}
            name="penalise"
            onChange={onChange}
            hasError={!!error}
          >
            Yes, penalise
          </RadioButton>
        </li>
        <li className="w-full sm:w-1/2">
          <RadioButton
            id={PenaliseOptions.No}
            value={PenaliseOptions.No}
            name="penalise"
            onChange={onChange}
            hasError={!!error}
          >
            No, don&apos;t penalise
          </RadioButton>
        </li>
      </ul>
      {!!error && (
        <p className="mt-1 text-sm text-negative-400">
          A penalised option is required
        </p>
      )}
    </div>
  );
};

export default RadioButtons;
