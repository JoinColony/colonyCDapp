import { FieldErrorsImpl, UseFormRegister } from 'react-hook-form';

import { FormRadioButton } from '~common/Extensions/Fields/RadioList/types';
import { FormPercentageInput } from '~common/Extensions/SpecialInput/types';

export interface SpecialInputProps {
  defaultValue?: number | string;
  maxValue?: number;
  minValue?: number;
  name?: string;
  register?: UseFormRegister<FormRadioButton | FormPercentageInput>;
  errors?: Partial<
    | FieldErrorsImpl<{
        percent: number;
        hours: number;
      }>
    | undefined
  >;
}
