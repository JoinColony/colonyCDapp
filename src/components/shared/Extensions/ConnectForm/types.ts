import { type SyntheticEvent } from 'react';
import { type FieldErrorsImpl, type UseFormRegister } from 'react-hook-form';

import { type FormRadioButton } from '~common/Extensions/Fields/RadioList/types.ts';
import { type FormPercentageInput } from '~common/Extensions/SpecialInput/types.ts';

export interface SpecialInputProps {
  name: string;
  defaultValue?: number | string;
  max?: number;
  min?: number;
  step?: number;
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
