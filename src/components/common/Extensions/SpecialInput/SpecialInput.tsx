import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import SpecialInputBase from './SpecialInputBase.tsx';
import { type SpecialInputProps } from './types.ts';

const displayName = 'common.Extensions.SpecialInput';

const SpecialInput: FC<SpecialInputProps> = ({ name, min, max, ...rest }) => {
  const { register } = useFormContext();

  return <SpecialInputBase {...register(name)} {...rest} min={min} max={max} />;
};
SpecialInput.displayName = displayName;

export default SpecialInput;
