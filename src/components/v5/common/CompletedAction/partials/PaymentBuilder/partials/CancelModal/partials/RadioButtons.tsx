import React from 'react';
import { useController } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';

import RadioButton from './RadioButton.tsx';
import { PenaliseOptions } from './types.ts';

const displayName =
  'v5.common.CompletedAction.partials.PaymentBuilder.partials.CancelModal';

const MSG = defineMessages({
  noPenaliseRadio: {
    id: `${displayName}.noPenaliseRadio`,
    defaultMessage: `No, don't penalise`,
  },
  penaliseRadio: {
    id: `${displayName}.penaliseRadio`,
    defaultMessage: 'Yes, penalise',
  },
  requiredOptionInfo: {
    id: `${displayName}.requiredOptionInfo`,
    defaultMessage: 'A penalised option is required',
  },
});

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
            {formatText(MSG.penaliseRadio)}
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
            {formatText(MSG.noPenaliseRadio)}
          </RadioButton>
        </li>
      </ul>
      {!!error && (
        <p className="mt-1 text-sm text-negative-400">
          {formatText(MSG.requiredOptionInfo)}
        </p>
      )}
    </div>
  );
};

export default RadioButtons;
