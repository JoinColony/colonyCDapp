import React, { useCallback, type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import FormInput from '~v5/common/Fields/InputBase/FormInput.tsx';

import { validateDynamicMethodInput } from './consts.ts';
import { MSG } from './translation.ts';

interface MethodInputProps {
  name: string;
  type: string;
}
export const MethodInput: FC<MethodInputProps> = ({ name, type }) => {
  const getValidateDynamicMethodInput = useCallback(() => {
    return validateDynamicMethodInput(type);
  }, [type]);

  return (
    <FormInput<any>
      name={`args.${name}.value`}
      label={`${name} (${type})`}
      registerOptions={{ validate: getValidateDynamicMethodInput() }}
      placeholder={formatText(MSG.dynamicFieldPlaceholder)}
    />
  );
};
