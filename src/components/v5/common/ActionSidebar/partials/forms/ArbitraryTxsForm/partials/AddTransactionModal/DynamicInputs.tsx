import { Interface } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import FormInput from '~v5/common/Fields/InputBase/FormInput.tsx';
import FormSelect from '~v5/common/Fields/Select/FormSelect.tsx';

import { validateDynamicMethodInput } from './consts.ts';

interface JsonAbiInputProps {
  disabled?: boolean;
}
export const DynamicInputs: React.FC<JsonAbiInputProps> = () => {
  const { watch, setValue } = useFormContext();
  const jsonAbiField = watch('jsonAbi');
  const selectedMethod = watch('method');
  const [methodOptions, setMethodOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [methodInputs, setMethodInputs] = useState<
    Array<{ name: string; type: string }>
  >([]);

  useEffect(() => {
    setValue('method', '');
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
          setValue(`args.${item.name}.type`, item.type);
        });
      } catch (e) {
        setMethodInputs([]);
      }
    }
  }, [selectedMethod, jsonAbiField, setValue]);

  return (
    <div className="flex flex-col gap-4">
      {!!methodOptions.length && (
        <FormSelect
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
