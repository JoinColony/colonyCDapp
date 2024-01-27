import { SyntheticEvent } from 'react';
import { FieldErrorsImpl, UseFormRegister } from 'react-hook-form';

import { FormRadioButton } from '~common/Extensions/Fields/RadioList/types.ts';
import { FormPercentageInput } from '~common/Extensions/SpecialInput/types.ts';

export interface SpecialInputProps {
  defaultValue?: number | string;
  max?: number;
  min?: number;
  step?: number;
  name?: string;
  register?: UseFormRegister<FormRadioButton | FormPercentageInput>;
  onInputChange?: (e: SyntheticEvent<HTMLInputElement>) => void;
  errors?: Partial<
    | FieldErrorsImpl<{
        percent: number;
        hours: number;
      }>
    | undefined
  >;
}
