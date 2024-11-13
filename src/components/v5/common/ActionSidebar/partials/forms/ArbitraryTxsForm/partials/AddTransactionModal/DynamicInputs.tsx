import { Interface, type ParamType } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import FormInput from '~v5/common/Fields/InputBase/FormInput.tsx';
import FormSelect from '~v5/common/Fields/Select/FormSelect.tsx';

import { validateDynamicMethodInput } from './consts.ts';
import { MSG } from './translation.ts';

interface MethodItem {
  value: string;
  label: string;
}

export const DynamicInputs: React.FC = () => {
  const { watch, setValue } = useFormContext();
  const jsonAbiField = watch('jsonAbi');
  const selectedMethod = watch('method');
  const [methodOptions, setMethodOptions] = useState<MethodItem[]>([]);
  const [methodInputs, setMethodInputs] = useState<ParamType[]>([]);

  useEffect(() => {
    setValue('method', ''); // Clean method field when jsonAbi updated
    setMethodInputs([]);
    setMethodOptions([]);
    if (jsonAbiField) {
      try {
        const IJsonAbi = new Interface(jsonAbiField);
        const functions = IJsonAbi.fragments
          .filter(({ type }) => type === 'function')
          .map((item) => item.name);
        const options =
          functions?.map((func) => ({ value: func, label: func })) || [];
        setMethodOptions(options);
      } catch (e) {
        setMethodOptions([]);
      }
    }
  }, [jsonAbiField, setValue]);

  useEffect(() => {
    if (selectedMethod && jsonAbiField) {
      try {
        const IJsonAbi = new Interface(jsonAbiField);
        const functionFragment = IJsonAbi.getFunction(selectedMethod);
        setMethodInputs(functionFragment.inputs);
        functionFragment.inputs.forEach((item) => {
          setValue(`args.${item.name}.type`, item.type); // Setting type as value to use it in table rendering
        });
      } catch (e) {
        setMethodInputs([]);
      }
    }
  }, [selectedMethod, jsonAbiField, setValue]);

  if (!methodOptions.length && !methodInputs.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {!!methodOptions.length && (
        <FormSelect
          labelMessage={formatText(MSG.methodsField)}
          name="method"
          options={methodOptions}
          rules={{ required: 'Required' }}
        />
      )}
      {methodInputs.map((input) => (
        <FormInput<any>
          key={input.name}
          name={`args.${input.name}.value`}
          label={`${input.name} (${input.type})`}
          registerOptions={{ validate: validateDynamicMethodInput(input.type) }}
        />
      ))}
    </div>
  );
};
