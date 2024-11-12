import { Interface } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import FormInput from '~v5/common/Fields/InputBase/FormInput.tsx';
import FormSelect from '~v5/common/Fields/Select/FormSelect.tsx';

interface JsonAbiInputProps {
  disabled?: boolean;
}
export const DynamicInputs: React.FC<JsonAbiInputProps> = () => {
  const { watch } = useFormContext();
  const jsonAbiField = watch('jsonAbi');
  const selectedMethod = watch('method');
  const [methodOptions, setMethodOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [methodInputs, setMethodInputs] = useState<
    Array<{ name: string; type: string }>
  >([]);

  useEffect(() => {
    if (jsonAbiField) {
      try {
        const IJsonAbi = new Interface(jsonAbiField);
        const functions = Object.keys(IJsonAbi.functions);
        const options =
          functions?.map((func) => ({ value: func, label: func })) || [];
        setMethodOptions(options);
      } catch (e) {
        setMethodOptions([]);
      }
    }
  }, [jsonAbiField]);

  useEffect(() => {
    if (selectedMethod && jsonAbiField) {
      try {
        const IJsonAbi = new Interface(jsonAbiField);
        const functionFragment = IJsonAbi.getFunction(selectedMethod);
        setMethodInputs(functionFragment.inputs);
      } catch (e) {
        setMethodInputs([]);
      }
    }
  }, [selectedMethod, jsonAbiField]);

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
        <FormInput
          key={input.name}
          name={`args.${input.name}`}
          label={`${input.name} (${input.type})`}
          registerOptions={{ required: 'Required' }}
        />
      ))}
    </div>
  );
};
