import { Interface, type ParamType } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import FormSelect from '~v5/common/Fields/Select/FormSelect.tsx';

import { abiFunctionsFilterFn, validateMethod } from './consts.ts';
import { MethodInput } from './MethodInput.tsx';
import { MSG } from './translation.ts';

interface MethodItem {
  value: string;
  label: string;
}

export const DynamicInputs: React.FC = () => {
  const { watch, setValue, unregister } = useFormContext();
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
          .filter(abiFunctionsFilterFn)
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

        // Remove previous method inputs
        methodInputs.forEach((input) => {
          unregister(`args.${input.name}`);
        });

        setMethodInputs(functionFragment.inputs);
        functionFragment.inputs.forEach((item) => {
          setValue(`args.${item.name}.type`, item.type); // Setting type as value to use it in table rendering
        });
      } catch (e) {
        setMethodInputs([]);
      }
    } else {
      // Clear method inputs when no method is selected
      setMethodInputs([]);
    }
    // this line is disabled to not add methodInputs to dependencies and avoid infinite reloading
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMethod, jsonAbiField, setValue, unregister]);

  if (!methodOptions.length && !methodInputs.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {!!methodOptions.length && (
        <FormSelect
          labelMessage={formatText(MSG.methodsField)}
          placeholder={formatText(MSG.methodsPlaceholder)}
          name="method"
          options={methodOptions}
          rules={{ validate: validateMethod }}
        />
      )}
      {methodInputs.map((input) => (
        <MethodInput key={input.name} name={input.name} type={input.type} />
      ))}
    </div>
  );
};
