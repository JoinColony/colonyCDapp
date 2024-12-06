import React, { useCallback, type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import FormInput from '~v5/common/Fields/InputBase/FormInput.tsx';

import { validateDynamicMethodInput } from './consts.ts';
import { MSG } from './translation.ts';

interface MethodInputProps {
  name: string;
  type: string;
  index: number;
}
export const MethodInput: FC<MethodInputProps> = ({ name, type, index }) => {
  const getValidateDynamicMethodInput = useCallback(() => {
    return validateDynamicMethodInput(type);
  }, [type]);

  return (
    <FormInput<any>
      name={`args[${index}].value`}
      label={`${name} (${type})`}
      registerOptions={{ validate: getValidateDynamicMethodInput() }}
      placeholder={formatText(MSG.dynamicFieldPlaceholder)}
    />
  );
};
